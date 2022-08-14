import { iValidator } from '../../../../src/auth/presentation/iutils/ivalidator';
import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';
import { Validator } from '../../../../src/global/utils/validator';

export interface ISignUpRequestDTO {
username:string;
email:string;
password:string;
}

class SignUpController {
  constructor (
      private validator: iValidator
  ) {}

  async handle (req: HttpRequest<ISignUpRequestDTO>) {
    const { username, email, password } = req.body;
    if (!email) { return HttpResponse.badRequest('email'); }
    if (!username) { return HttpResponse.badRequest('username'); }
    if (!password) { return HttpResponse.badRequest('password'); }

    const isEmailValid = this.validator.isEmailValid(email);
    const isPasswordValid = this.validator.isPasswordValid(password);
    if (!isEmailValid) { return HttpResponse.badRequest('email', 'invalid'); }
    if (!isPasswordValid) { return HttpResponse.badRequest('password', 'invalid'); }
  }
}

const makeSut = () => {
  const validator = new Validator();
  const sut = new SignUpController(validator);

  return { sut, validator };
};

describe('SignUpController', () => {
  it('should return a 400 if email is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: '',
      password: 'a*valid@password'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('email'));
  });
  it('should return a 400 if username is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: '',
      email: 'validemail@gmail.com',
      password: 'a*valid@password'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('username'));
  });
  it('should return a 400 if password is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: 'validemail@gmail.com',
      password: ''
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('password'));
  });
  it('should return a 400 if email is invalid', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: 'invalidemail.com',
      password: '*178267*¨1h1j*'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('email', 'invalid'));
  });
  it('should return a 400 if password is invalid', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: 'valid.email@gmail.com',
      password: '12345678'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('password', 'invalid'));
  });
});
