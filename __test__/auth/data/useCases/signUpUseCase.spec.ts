import { EmptyParamFieldError } from '../../../../src/global/errors/EmptyParamFieldError';
import { User } from '../../../../src/auth/domain/entities/user';
import { iSignUpUseCase, iSignUpUseCaseParams } from '../../../../src/auth/domain/iuseCases/isignUpUseCase';

export interface iSignUpMethodRepository {
username:string;
email:string;
password:string
}

export interface iSignUpRepository {
getByEmail(email:string):Promise<User|null>;
getByUsername(username:string):Promise<User|null>;
signUp(params: iSignUpMethodRepository): Promise<User>
}

export class SignUpUseCase implements iSignUpUseCase {
  constructor (private repository: iSignUpRepository) {}
  async execute (params: iSignUpUseCaseParams) {
    if (!params.email) { throw new EmptyParamFieldError('email'); }
    if (!params.password) { throw new EmptyParamFieldError('password'); }
    if (!params.username) { throw new EmptyParamFieldError('username'); }

    const emailAlreadyExist = await this.repository.getByEmail(params.email);
    const usernameAlreadyExist = await this.repository.getByUsername(params.username);

    if (emailAlreadyExist || usernameAlreadyExist) {
      return {
        username: '',
        email: '',
        id: '',
        createdAccountAt: 2938239,
        emailAlreadyExist: !!emailAlreadyExist,
        usernameAlreadyExist: !!usernameAlreadyExist
      };
    }

    const userRegistered = await this.repository.signUp(params);

    return {
      username: userRegistered.username,
      email: userRegistered.email,
      id: userRegistered.id,
      createdAccountAt: userRegistered.createdAccountAt,
      emailAlreadyExist: !!emailAlreadyExist,
      usernameAlreadyExist: !!usernameAlreadyExist
    };
  }
}

const user = {
  username: 'c4ct0',
  email: 'matheus.reis@gmai.com',
  createdAccountAt: 12334303890383,
  id: '8ah3ah73a283h38'
};
const makeSut = () => {
  const repository = {
    getByEmail: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve(null))),
    getByUsername: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve(null))),
    signUp: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve(user)))

  };
  const sut = new SignUpUseCase(repository);

  return { sut, repository };
};

const params = { username: 'Username', email: 'valid.email@gmail.com', password: '1223h382' };
describe('SignUpUseCase', () => {
  it('should throw if email is empty', async () => {
    const { sut } = makeSut();
    const errorParams = { username: 'Username', email: '', password: '1223h382' };
    expect(async () => await sut.execute(errorParams)).rejects.toThrow(new EmptyParamFieldError('email'));
  });
  it('should throw if password is empty', async () => {
    const { sut } = makeSut();
    const errorParams = { username: 'Username', email: 'valid.email@gmail.com', password: '' };
    expect(async () => await sut.execute(errorParams)).rejects.toThrow(new EmptyParamFieldError('password'));
  });
  it('should throw if username is empty', async () => {
    const { sut } = makeSut();
    const errorParams = { username: '', email: 'valid.email@gmail.com', password: '1223h382' };
    expect(async () => await sut.execute(errorParams)).rejects.toThrow(new EmptyParamFieldError('username'));
  });
  it('should getByEmail method of repository receive right email', async () => {
    const { sut, repository } = makeSut();

    await sut.execute(params);

    expect(repository.getByEmail).toBeCalledWith(params.email);
  });
  it('should getByUsername method of repository receive right email', async () => {
    const { sut, repository } = makeSut();

    await sut.execute(params);

    expect(repository.getByUsername).toBeCalledWith(params.username);
  });
  it('should return that email exist in case of repository getByEmail method returns a user', async () => {
    const repository = {
      getByEmail: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve(user))),
      getByUsername: jest.fn(),
      signUp: jest.fn()
    };
    const sut = new SignUpUseCase(repository);

    const response = await sut.execute(params);

    expect(response.emailAlreadyExist).toBe(true);
    expect(response.usernameAlreadyExist).toBe(false);
  });
  it('should return that username exist in case of repository getByUsername method returns a user', async () => {
    const repository = {
      getByUsername: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve(user))),
      getByEmail: jest.fn(),
      signUp: jest.fn()
    };
    const sut = new SignUpUseCase(repository);

    const response = await sut.execute(params);

    expect(response.usernameAlreadyExist).toBe(true);
    expect(response.emailAlreadyExist).toBe(false);
  });
  it('should signUp method of repository receive right params in case of user not exist', async () => {
    const { sut, repository } = makeSut();

    await sut.execute(params);

    expect(repository.signUp).toBeCalledWith(params);
  });
  it('should signUp method of repository return the registered user in case of all is ok', async () => {
    const { sut, repository } = makeSut();

    const response = await sut.execute(params);
    const userRegistered = await repository.signUp();

    const expectedResponse = {
      username: userRegistered.username,
      email: userRegistered.email,
      id: userRegistered.id,
      createdAccountAt: userRegistered.createdAccountAt,
      emailAlreadyExist: false,
      usernameAlreadyExist: false
    };

    expect(response).toEqual(expectedResponse);
  });
  it('should throws if getByEmail method of repository throws', async () => {
    const errorRepository = {
      signUp: jest.fn(),
      getByEmail: () => { throw new Error(); },
      getByUsername: jest.fn()
    };
    const sut = new SignUpUseCase(errorRepository);

    expect(async () => await sut.execute(params)).rejects.toThrow();
  });
  it('should throws if getByUsername method of repository throws', async () => {
    const errorRepository = {
      signUp: jest.fn(),
      getByEmail: jest.fn(),
      getByUsername: () => { throw new Error(); }
    };
    const sut = new SignUpUseCase(errorRepository);

    expect(async () => await sut.execute(params)).rejects.toThrow();
  });
  it('should throws if signUp method of repository throws', async () => {
    const errorRepository = {
      signUp: () => { throw new Error(); },
      getByEmail: jest.fn(),
      getByUsername: jest.fn()
    };
    const sut = new SignUpUseCase(errorRepository);

    expect(async () => await sut.execute(params)).rejects.toThrow();
  });
});
