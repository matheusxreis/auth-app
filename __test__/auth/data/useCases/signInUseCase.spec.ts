import { EmptyParamFieldError } from '../../../../src/global/errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../../../src/global/errors/InvalidInjectionError';
import { iGetByEmailRepository } from '../../../../src/auth/data/irepositories/igetByEmailRepository';
import { SignInUseCase } from '../../../../src/auth/data/useCases/signInUseCase';
import { User } from '../../../../src/auth/domain/entities/user';
import { iEncrypterCompareRepository } from '../../../../src/auth/data/irepositories/iencrypterCompareRepository';

const makeSut = () => {
  const repository = {
    getUserByEmail: async () =>
      await new Promise<User|null>((resolve, reject) =>
        resolve({
          username: 'UserName',
          email: 'A valid email',
          _id: '92782k2j',
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
  const generateToken = {
    generate: async () =>
      await new Promise<string>((resolve, reject) =>
        resolve('access_token'))
        .then(x => x)
  };
  const errorGenerateToken = {
    generate: async () =>
      await new Promise<string>((resolve, reject) =>
        resolve(''))
        .then(x => x)
  };
  const errorRepository = {} as iGetByEmailRepository;
  const sut = new SignInUseCase(repository, encrypter, generateToken);
  const errorSut = new SignInUseCase(errorRepository, encrypter, generateToken);

  return { sut, repository, errorSut, encrypter, generateToken, errorGenerateToken };
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
    const { encrypter, generateToken } = makeSut();
    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getUserByEmail: jest.fn()
    };
    const email = 'correct.email@gmail.com';
    const sut = new SignInUseCase(repository, encrypter, generateToken);
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
    const { sut, repository, generateToken } = makeSut();

    const result = await sut.execute('valid.email@gmail.com', '123456789');
    const userData = await repository.getUserByEmail() as User;
    const user = {
      username: userData.username,
      _id: userData._id
    };

    const token = await generateToken.generate();

    const formattedResult = {
      user: result!.user,
      timestamp: new Date(result!.timestamp).getDay(),
      token: result!.token
    };

    expect(formattedResult).toEqual({
      user,
      timestamp: new Date(result!.timestamp).getDay(),
      token
    });
  });
  it('should return null if has no user in database with email', async () => {
    const { encrypter, generateToken } = makeSut();
    const repository = {
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as iGetByEmailRepository;

    const useCase = new SignInUseCase(repository, encrypter, generateToken);

    expect(await useCase.execute('email@email.com', '123456')).toBeNull();
  });
  it('should encrypter receive correct password to compare', async () => {
    const { repository, generateToken } = makeSut();

    const encrypter = { compare: jest.fn() };
    const sut = new SignInUseCase(repository, encrypter, generateToken);
    const password = '1234567*';
    const user = await repository.getUserByEmail() as User;
    await sut.execute('valid_email@gmail.com', password);

    expect(encrypter.compare).toBeCalledWith(password, user.hashPassword);
  });
  it('should not call encrypter compare method if has no user in database with email', async () => {
    const { generateToken } = makeSut();
    const encrypter = { compare: jest.fn() };
    const repository = {
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as iGetByEmailRepository;

    const useCase = new SignInUseCase(repository, encrypter, generateToken);
    await useCase.execute('unexisted.email@gmail.com', '12*787&1');
    expect(encrypter.compare).not.toBeCalled();
  });
  it('should return null if encrypter compare method return false', async () => {
    const { repository, generateToken } = makeSut();
    const encrypter = {
      compare: async () => new Promise((resolve, reject) =>
        resolve(null))
        .then(x => x)
    } as iEncrypterCompareRepository;
    const sut = new SignInUseCase(repository, encrypter, generateToken);

    const returnSut = await sut.execute('valid_email@gmail.com', '1234567*');

    expect(returnSut).toBeNull();
  });
  it('should generateToken receive correct userId to generate the token', async () => {
    const { repository, encrypter } = makeSut();
    const generateToken = { generate: jest.fn().mockImplementation(() => 'access_token') };
    const sut = new SignInUseCase(repository, encrypter, generateToken);

    await sut.execute('valid.email@gmail.com', '1234*71571');
    const user = await repository.getUserByEmail();

    expect(generateToken.generate).toBeCalledWith(user!._id);
  });
  it('should not call generateToken generate method if has no user in database with email', async () => {
    const { encrypter } = makeSut();
    const generateToken = { generate: jest.fn() };
    const repository = {
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as iGetByEmailRepository;
    const useCase = new SignInUseCase(repository, encrypter, generateToken);
    await useCase.execute('unexisted.email@gmail.com', '12*787&1');
    expect(generateToken.generate).not.toBeCalled();
  });
  it('should throw if generateToken not return a access_token', async () => {
    const {
      repository,
      encrypter,
      errorGenerateToken: generateToken
    } = makeSut();
    const sut = new SignInUseCase(repository, encrypter, generateToken);

    expect(async () => await sut.execute('valid.email@gmail.com', '12347*&6'))
      .rejects.toThrow();
  });
  it('should throw if encrypter throws', async () => {
    const { repository, generateToken } = makeSut();
    const encrypter = { compare: () => { throw new Error(); } };
    const sut = new SignInUseCase(repository, encrypter, generateToken);

    expect(async () => await sut.execute('email@right.com.br', '91272872812')).rejects.toThrow();
  });
  it('should throw if generateToken throws', async () => {
    const { repository, encrypter } = makeSut();
    const generateToken = { generate: () => { throw new Error(); } };
    const sut = new SignInUseCase(repository, encrypter, generateToken);

    expect(async () => await sut.execute('email@right.com.br', '91272872812')).rejects.toThrow();
  });
});
