
import { EmptyParamFieldError } from '../../../../src/auth/domain/errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../../../src/auth/domain/errors/InvalidInjectionError';
import { IAuthRepository } from '../../../../src/auth/domain/irepositories/authRepository';

class SignInUseCase {
  constructor (private authRepository: IAuthRepository) {}

  async execute (email: string, password: string) {
    if (!email) {
      throw new EmptyParamFieldError('email');
    }
    if (!password) {
      throw new EmptyParamFieldError('password');
    }
    if (!this.authRepository.signIn) {
      throw new InvalidInjectionError('AuthRepository must has a signIn method', 'SignInUseCase');
    }
    await this.authRepository.signIn(email, password);
  }
}

const makeSut = () => {
  const repository = {
    signIn: jest.fn(),
    signUp: jest.fn()
  };
  const errorRepository = {} as IAuthRepository;
  const sut = new SignInUseCase(repository);
  const errorSut = new SignInUseCase(errorRepository);

  return { sut, repository, errorSut };
};

describe('SignInUseCase', () => {
  it('should throw a error if email is empty', async () => {
    const { sut } = makeSut();

    expect(async () => await sut.execute('', 'password')).rejects.toThrow(new EmptyParamFieldError('email'));
  });
  it('should throw a error if password is empty', async () => {
    const { sut } = makeSut();

    expect(async () => await sut.execute('matheus.reis@gmail.com', '')).rejects.toThrow(new EmptyParamFieldError('password'));
  });
  it('should repository receive email and password correctly', async () => {
    const email = 'email.correct@gmail.com';
    const password = '123*456*78';

    const repository = {
      signIn: jest.fn(),
      signUp: jest.fn()
    };
    const sut = new SignInUseCase(repository);

    await sut.execute(email, password);

    expect(repository.signIn).toBeCalledWith(email, password);
  });
  it('should throw a error if receive a not valid repository throught constructor', async () => {
    const { errorSut: sut } = makeSut();

    expect(async () => await sut.execute('valid@gmail.com', 'valid')).rejects.toThrow(new InvalidInjectionError('AuthRepository must has a signIn method', 'SignInUseCase'));
  });
});
