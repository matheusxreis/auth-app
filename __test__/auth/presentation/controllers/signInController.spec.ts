
import { SignInRequestDTO } from '../../../../src/auth/presentation/dtos/SignInRequestDTO';
import { SignInController } from '../../../../src/auth/presentation/controllers/signInController';
import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';

describe('POST /signin', () => {
  it('should return a response status 200 if all is ok', () => {
    const sup = new SignInController();
    const data = { email: 'email@teste.com.br', password: 'password' };
    const request = new HttpRequest(data);
    const response = sup.handle(request);

    expect(response).toEqual(HttpResponse.ok());
  });

  it('should return a error 400 if email is empty', () => {
    const sup = new SignInController();
    const data = { email: '', password: 'password' };
    const request = new HttpRequest(data);
    const response = sup.handle(request);

    expect(response).toEqual(HttpResponse.badRequest('email'));
  });

  it('should return a error 400 if password is empty', () => {
    const sup = new SignInController();
    const data = { email: 'email@test.com.br', password: '' };
    const request = new HttpRequest(data);
    const response = sup.handle(request);

    expect(response).toEqual(HttpResponse.badRequest('password'));
  });

  it('should return a error 500 if request body is empty', () => {
    const sup = new SignInController();
    const data = {} as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = sup.handle(request);

    expect(response).toEqual(HttpResponse.serverError());
  });
});
