
import { SignInRequestDTO } from '../../../../src/auth/presentation/dtos/SignInRequestDTO';
import { SignInController } from '../../../../src/auth/presentation/controllers/signInController';
import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';

// sut = system under test - the system which is being testing
const makeSut = () => {
  const signInUseCase = { execute: jest.fn() };
  const failedSignInUseCase = { execute: () => { throw new Error(); } };
  const sut = new SignInController(signInUseCase);
  const errorSut = new SignInController(failedSignInUseCase);

  return { sut, signInUseCase, errorSut };
};

describe('POST /signin', () => {
  it('should return a response status 200 if all is ok', () => {
    const { sut } = makeSut();
    const data = { email: 'email@teste.com.br', password: 'password' };
    const request = new HttpRequest(data);
    const response = sut.handle(request);

    expect(response).toEqual(HttpResponse.ok());
  });

  it('should return a error 400 if email is empty', () => {
    const { sut } = makeSut();
    const data = { email: '', password: 'password' };
    const request = new HttpRequest(data);
    const response = sut.handle(request);

    expect(response).toEqual(HttpResponse.badRequest('email'));
  });

  it('should return a error 400 if password is empty', () => {
    const { sut } = makeSut();
    const data = { email: 'email@test.com.br', password: '' };
    const request = new HttpRequest(data);
    const response = sut.handle(request);

    expect(response).toEqual(HttpResponse.badRequest('password'));
  });

  it('should return a error 500 if request body is empty', () => {
    const { sut } = makeSut();
    const data = {} as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = sut.handle(request);

    expect(response).toEqual(HttpResponse.serverError());
  });

  it('should call usecase with correctly params', () => {
    const { sut, signInUseCase } = makeSut();

    const data = { email: 'email@teste.com.br', password: '12345' } as SignInRequestDTO;
    const request = new HttpRequest(data);

    sut.handle(request);

    expect(signInUseCase.execute).toBeCalledWith(data.email, data.password);
  });

  it('should return a error 401 in case of use case throw a error', () => {
    const { errorSut: sut } = makeSut();

    const data = { email: 'email@teste.com.br', password: '12345' } as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = sut.handle(request);

    expect(response).toEqual(HttpResponse.notAuthorized());
  });
});
