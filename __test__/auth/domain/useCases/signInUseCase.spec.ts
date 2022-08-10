
import { EmptyParamFieldError } from '../../../../src/auth/domain/errors/EmptyParamFieldError';
import { IAuthRepository } from '../../../../src/auth/domain/irepositories/authRepository';
import { SignInResponseDTO } from '../../../../src/auth/presentation/dtos/SignInResponseDTO';

// class AuthRepository implements IAuthRepository {
//   signIn (email: string, password: string): Promise<SignInResponseDTO> {
//     return null;
//   };

//   signUp (): void {
//     throw new Error('Method not implemented.');
//   }
// }
class SignInUseCase {
  constructor (private authRepository: IAuthRepository) {}

  async execute (email: string, password: string) {
    if (!email) {
      throw new EmptyParamFieldError('email');
    }
    if (!password) {
      throw new EmptyParamFieldError('password');
    }

    await this.authRepository.signIn(email, password);
  }
}

const makeSut = () => {
  const repository = {
    signIn: jest.fn(),
    signUp: jest.fn()
  };
  const sut = new SignInUseCase(repository);

  return { sut, repository };
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

    const { sut, repository } = makeSut();

    await sut.execute(email, password);

    expect(repository.signIn).toBeCalledWith(email, password);
  });
});
