import { EmptyParamFieldError } from '../../../../src/auth/data/errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../../../src/auth/data/errors/InvalidInjectionError';
import { IGetByEmailRepository } from '../../../../src/auth/data/irepositories/igetByEmailRepository';
import { SignInUseCase } from '../../../../src/auth/data/useCases/signInUseCase';
import { User } from '../../../../src/auth/domain/entities/user';
import { iEncrypterRepository } from '../../../../src/auth/data/irepositories/iencrypterRepository';

const makeSut = () => {
  const repository = {
    getUserByEmail: async () =>
      await new Promise<User|null>((resolve, reject) =>
        resolve({
          name: 'UserName',
          email: 'A valid email',
          id: '92782k2j',
          hashPassword: '162yhj2mk*(72g23232',
          createdAccountAt: 12729272828
        })
      ).then(x => x)
  };
  const encrypter = {
    compare: async () =>
      await new Promise<Boolean>((resolve, reject) =>
        resolve(true))
        .then(x => x)
  };
  const errorRepository = {} as IGetByEmailRepository;
  const sut = new SignInUseCase(repository, encrypter);
  const errorSut = new SignInUseCase(errorRepository, encrypter);

  return { sut, repository, errorSut, encrypter };
};

describe('SignInUseCase', () => {
  it('should throw a error if email is empty', async () => {
    const { sut } = makeSut();

    expect(async () => await sut.execute('', 'password')).rejects.toThrow(
      new EmptyParamFieldError('email')
    );
  });
  it('should throw a error if password is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.execute('matheus.reis@gmail.com', '')
    ).rejects.toThrow(new EmptyParamFieldError('password'));
  });
  it('should repository getUserByEmail method receive email correct', async () => {
    const { encrypter } = makeSut();
    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getUserByEmail: jest.fn()
    };
    const email = 'correct.email@gmail.com';
    const sut = new SignInUseCase(repository, encrypter);
    await sut.execute(email, '123455*&90');
    expect(repository.getUserByEmail).toBeCalledWith(email);
  });
  it('should throw a error if receive a not valid repository throught constructor', async () => {
    const { errorSut: sut } = makeSut();

    expect(
      async () => await sut.execute('valid@gmail.com', 'valid')
    ).rejects.toThrow(
      new InvalidInjectionError(
        'AuthRepository must has a signIn method',
        'SignInUseCase'
      )
    );
  });
  it('should return a signInResponseDTO if all is ok', async () => {
    const { sut, repository } = makeSut();

    const result = await sut.execute('valid.email@gmail.com', '123456789');
    const userData = await repository.getUserByEmail() as User;
    const user = {
      username: userData.name,
      id: userData.id
    };
    expect(result).toEqual({
      user,
      timestap: 12345,
      token: 'access_token'
    });
  });
  it('should return null if has no user in database with email', async () => {
    const { encrypter } = makeSut();
    const repository = {
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as IGetByEmailRepository;

    const useCase = new SignInUseCase(repository, encrypter);

    expect(await useCase.execute('email@email.com', '123456')).toBeNull();
  });
  it('should encrypter receive correct password to compare', async () => {
    const { repository } = makeSut();

    const encrypter = { compare: jest.fn() };
    const sut = new SignInUseCase(repository, encrypter);
    const password = '1234567*';
    const user = await repository.getUserByEmail() as User;
    await sut.execute('valid_email@gmail.com', password);

    expect(encrypter.compare).toBeCalledWith(password, user.hashPassword);
  });
  it('should not call encrypter compare method if has no user in database with email', async () => {
    const encrypter = { compare: jest.fn() };
    const repository = {
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as IGetByEmailRepository;

    const useCase = new SignInUseCase(repository, encrypter);
    await useCase.execute('unexisted.email@gmail.com', '12*787&1');
    expect(encrypter.compare).not.toBeCalled();
  });
  it('should return null if bcrypt compare method return false', async () => {
    const { repository } = makeSut();
    const encrypter = {
      compare: async () => new Promise((resolve, reject) =>
        resolve(null))
        .then(x => x)
    } as iEncrypterRepository;
    const sut = new SignInUseCase(repository, encrypter);

    const returnSut = await sut.execute('valid_email@gmail.com', '1234567*');

    expect(returnSut).toBeNull();
  });
});
