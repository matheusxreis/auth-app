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

const deleteUser = async (key:string, value:string) => {
  return UserModel.findOneAndDelete({ [key]: value });
};

beforeEach(async () => {
  await mongoose.connect(`${process.env.MONGO_URL}`)
    .then(() => console.log('CONNECTED', process.env.MONGO_URL))
    .catch((err) => { throw new Error(err); });
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
  it('should return a null if a not existence email is passed', async () => {
    const { sut } = makeSut();
    const x = await sut.getUserByEmail('notexistenceemail@email.com');
    expect(x).toBeNull();
  });
  it('should return a user if a email existence is passed', async () => {
    const { sut } = makeSut();
    await saveUser();
    const email = 'valid.email@email.com';
    const user: User | null = await sut.getUserByEmail(email);
    expect(user?.email).toBe(email);
    expect(user).not.toBeNull();
    await deleteUser('email', 'valid.email@email.com');
  });
});
