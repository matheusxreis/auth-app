import { EmptyParamFieldError } from '../../../../src/global/errors/EmptyParamFieldError';
import { User } from '../../../../src/auth/domain/entities/user';
interface ISignUpExecuteParams {
username: string,
password: string,
email:string
}

export interface iSignUpRepository {
getByEmail():Promise<User|null>;
getByUsername():Promise<User|null>;
}

export class SignUpUseCase {
  async execute (params: ISignUpExecuteParams) {
    if (!params.email) { throw new EmptyParamFieldError('email'); }
    if (!params.password) { throw new EmptyParamFieldError('password'); }
    if (!params.username) { throw new EmptyParamFieldError('username'); }
  }
}

const makeSut = () => {
  const sut = new SignUpUseCase();

  return { sut };
};

// const params = { username: 'Username', email: 'valid.email@gmail.com', password: '1223h382' };
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
});
