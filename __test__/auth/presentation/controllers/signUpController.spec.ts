import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';

export interface ISignUpRequestDTO {
username:string;
email:string;
password:string;
}

class SignUpController {
  async handle (req: HttpRequest<ISignUpRequestDTO>) {
    const { username, email, password } = req.body;

    if (!email) { return HttpResponse.badRequest('email'); }
    if (!username) { return HttpResponse.badRequest('username'); }
    if (!password) { return HttpResponse.badRequest('password'); }
  }
}

const makeSut = () => {
  const sut = new SignUpController();

  return { sut };
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
});
