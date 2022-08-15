import mongoose from 'mongoose';
import { User } from '../../../src/auth/domain/entities/user';
import { AuthRepository } from '../../../src/auth/infra/authRepository';
import { UserModel } from '../../../src/auth/infra/helpers/db/userModel';
import { EmptyParamFieldError } from '../../../src/global/errors/EmptyParamFieldError';

const makeSut = () => {
  const model = UserModel;
  const sut = new AuthRepository(model);

  return { sut, model };
};

const saveUser = async () => {
  return await new UserModel({
    email: 'valid.email@email.com',
    hashPassword: '28Y2H2U3¨719IY2317YBG6@8H177h8291928HA1Q8',
    createdAccountAt: new Date().getTime(),
    username: 'test-man'
  }).save();
};

const deleteUser = async () => {
  return UserModel.deleteMany();
};

beforeEach(async () => {
  await mongoose.connect(`${process.env.MONGO_URL}`)
    .then(() => console.log('CONNECTED', process.env.MONGO_URL))
    .catch((err) => { throw new Error(err); });
  await deleteUser();
});

afterEach(async () => {
  await mongoose.disconnect();
});

describe('authRepository', () => {
  it('should throws if getUserByEmail param is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.getUserByEmail('')
    ).rejects.toThrow(new EmptyParamFieldError('email'));
  });
  it('should return null if a not existence email is passed', async () => {
    const { sut } = makeSut();
    const x = await sut.getUserByEmail('notexistenceemail@email.com');
    expect(x).toBeNull();
  });
  it('should return a user if a existence email is passed', async () => {
    const { sut } = makeSut();
    await saveUser();
    const email = 'valid.email@email.com';
    const user: User | null = await sut.getUserByEmail(email);
    expect(user?.email).toBe(email);
    expect(user).not.toBeNull();
  });
  it('should throw if getUserByUsername param is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.getUserByUsername('')
    ).rejects.toThrow(new EmptyParamFieldError('username'));
  });
  it('should return null if a not existence username is passed', async () => {
    const { sut } = makeSut();
    await saveUser();
    const username = 'notexistenceusername';
    const user: User | null = await sut.getUserByEmail(username);
    expect(user).toBeNull();
  });
  it('should return a user if a username existence is passed', async () => {
    const { sut } = makeSut();
    await saveUser();
    const username = 'test-man';
    const user: User | null = await sut.getUserByUsername(username);
    expect(user?.username).toBe(username);
    expect(user).not.toBeNull();
  });
  it('should throw if email is empty in signUp method', async () => {
    const { sut } = makeSut();
    const params = {
      email: '',
      username: 'anyusername',
      hashPassword: 'anypasswordf1209238'
    };
    expect(
      async () => await sut.signUp(params)
    ).rejects.toThrow(new EmptyParamFieldError('email'));
  });
  it('should throw if username is empty in signUp method', async () => {
    const { sut } = makeSut();
    const params = {
      email: 'anyemail@gmail.com',
      username: '',
      hashPassword: 'anypasswordf1209238'
    };
    expect(
      async () => await sut.signUp(params)
    ).rejects.toThrow(new EmptyParamFieldError('username'));
  });
  it('should throw if hashPassword is empty in signUp method', async () => {
    const { sut } = makeSut();
    const params = {
      email: 'anyemail@gmail.com',
      username: 'anyusername',
      hashPassword: ''
    };
    expect(
      async () => await sut.signUp(params)
    ).rejects.toThrow(new EmptyParamFieldError('hashPassword'));
  });
  it('should save new user in database if all is ok', async () => {
    const { sut } = makeSut();
    const params = {
      email: 'any.email@email.com',
      username: 'anyusername',
      hashPassword: 'anypassword'
    };

    await sut.signUp(params);
    const newUserByEmail = await sut.getUserByEmail(params.email);
    const newUserByUsername = await sut.getUserByEmail(params.email);

    expect(newUserByEmail?.username).toBe(params.username);
    expect(newUserByUsername?.email).toBe(params.email);
  });
});
