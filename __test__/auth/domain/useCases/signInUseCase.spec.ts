
import { EmptyParamFieldError } from '../../../../src/auth/domain/errors/EmptyParamFieldError';
class SignInUseCase {
  async execute (email: string, password: string) {
    if (!email) {
      throw new EmptyParamFieldError('email');
    }
    if (!password) {
      throw new EmptyParamFieldError('password');
    }
  }
}

const makeSut = () => {
  const sut = new SignInUseCase();

  return { sut };
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
});
