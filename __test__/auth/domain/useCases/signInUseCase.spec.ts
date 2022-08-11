import { EmptyParamFieldError } from '../../../../src/auth/domain/errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../../../src/auth/domain/errors/InvalidInjectionError';
import { IAuthRepository } from '../../../../src/auth/domain/irepositories/authRepository';
import { SignInResponseDTO } from '../../../../src/auth/dtos/SignInResponseDTO';
import { SignInUseCase } from '../../../../src/auth/domain/useCases/SignInUseCase/signInUseCase';
import bcrypt from 'bcrypt';
import { User } from '../../../../src/auth/domain/entities/user';

const makeSut = () => {
  const repository = {
    signIn: async () =>
      await new Promise<SignInResponseDTO>((resolve, reject) =>
        resolve({
          user: { username: 'username', id: 'id' },
          timestamp: 12334,
          token: 'access_token_jwt'
        })
      ).then(x => x),
    signUp: jest.fn(),
    getUserByEmail: async () =>
      await new Promise<User|null>((resolve, reject) =>
        resolve({
          name: 'UserName',
          email: 'A valid email',
          hashPassword: '162yhj2mk*(72g23232',
          createdAccountAt: 12729272828
        })
      ).then(x => x)
  };
  const errorRepository = {} as IAuthRepository;
  const sut = new SignInUseCase(repository);
  const errorSut = new SignInUseCase(errorRepository);

  return { sut, repository, errorSut };
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
  it('should repository receive email and password correctly', async () => {
    const email = 'email.correct@gmail.com';
    const password = '123*456*78';

    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getUserByEmail: async () =>
        await new Promise<User|null>((resolve, reject) =>
          resolve({
            name: 'UserName',
            email: 'A valid email',
            hashPassword: '162yhj2mk*(72g23232',
            createdAccountAt: 12729272828
          })
        ).then(x => x)
    };
    const sut = new SignInUseCase(repository);

    await sut.execute(email, password);

    expect(repository.signIn).toBeCalledWith(email, password);
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

    expect(result).toEqual(await repository.signIn());
  });
  it('should return null if repository signIn method return null', async () => {
    const repository = {
      signIn: async () =>
        await new Promise<SignInResponseDTO | null>((resolve, reject) =>
          resolve(null)
        ).then(x => x),
      signUp: jest.fn(),
      getUserByEmail: jest.fn()
    };
    const sut = new SignInUseCase(repository);
    const result = await sut.execute('valid.email@gmail.com', '123456789');

    expect(result).toEqual(null);
  });
  it('should return null if has no user in database with email', async () => {
    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as IAuthRepository;

    const useCase = new SignInUseCase(repository);

    expect(await useCase.execute('email@email.com', '123456')).toBeNull();
  });
  it('should bcryp receive correct password to compare', async () => {
    const { sut, repository } = makeSut();
    const bcryptHash = jest.spyOn(bcrypt, 'compare');

    const password = '1234567*';
    const user = await repository.getUserByEmail() as User;
    await sut.execute('valid_email@gmail.com', password);

    expect(bcryptHash).toBeCalledWith(password, user.hashPassword);
  });
  it('should not call bcrypt compare method if has no user in database with email', async () => {
    const bcryptHash = jest.spyOn(bcrypt, 'compare');
    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getUserByEmail: async () => await new Promise((resolve, reject) => {
        resolve(null);
      }).then(x => x)
    } as IAuthRepository;

    const useCase = new SignInUseCase(repository);
    await useCase.execute('unexisted.email@gmail.com', '12*787&1');
    expect(bcryptHash).not.toBeCalled();
  });
});
