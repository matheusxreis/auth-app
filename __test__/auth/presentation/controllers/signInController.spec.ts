import { SignInRequestDTO } from '../../../../src/auth/presentation/dtos/SignInRequestDTO';
import { SignInController } from '../../../../src/auth/presentation/controllers/signInController';
import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';
import {
  ISignInUseCase,
  ISignInUseCaseReturn
} from '../../../../src/auth/domain/iuseCases/isignInUseCase';
// sut = system under test - the system which is being testing
const makeSut = () => {
  const signInUseCase = {
    execute: async () =>
      new Promise<ISignInUseCaseReturn>((resolve, reject) =>
        resolve({
          user: { username: 'username', id: 'id' },
          timestamp: 12334,
          token: 'access_token_jwt'
        })
      ).then(x => x)
  };
  const failedSignInUseCase = {
    execute: () => {
      throw new Error();
    }
  };
  const sut = new SignInController(signInUseCase);
  const errorSut = new SignInController(failedSignInUseCase);

  return { sut, signInUseCase, errorSut };
};

describe('SignInController', () => {
  it('should return a response status 200 if all is ok', async () => {
    const { sut, signInUseCase } = makeSut();
    const data = { email: 'email@teste.com.br', password: 'password' };
    const request = new HttpRequest(data);
    const response = await sut.handle(request);

    expect(response).toEqual(
      HttpResponse.ok(await signInUseCase.execute())
    );
  });
  it('should return a signInResponseDTO if all is ok', async () => {
    const signInUseCase = {
      execute: async () =>
        new Promise<ISignInUseCaseReturn>((resolve, reject) =>
          resolve({
            user: { username: 'username', id: 'id' },
            timestamp: 12334,
            token: 'access_token_jwt'
          })
        ).then(x => x)
    };
    const sut = new SignInController(signInUseCase);

    const data = { email: 'email@teste.com.br', password: 'password' };
    const request = new HttpRequest(data);
    const response = await sut.handle(request);

    const responseBody = await signInUseCase.execute();

    expect(response).toEqual(HttpResponse.ok(responseBody));
    expect(response).toHaveProperty('body');
    expect(response.body).toEqual(responseBody);
  });
  it('should return a error 400 if email is empty', async () => {
    const { sut } = makeSut();
    const data = { email: '', password: 'password' };
    const request = new HttpRequest(data);
    const response = await sut.handle(request);

    expect(response).toEqual(HttpResponse.badRequest('email'));
  });
  it('should return a error 400 if email is not valid', async () => {
    const { sut } = makeSut();
    const data = { email: 'invalid_email', password: 'password' };
    const request = new HttpRequest(data);
    const response = await sut.handle(request);
    expect(response).toEqual(HttpResponse.badRequest('email', 'invalid'));
  });
  it('should return a error 400 if password is empty', async () => {
    const { sut } = makeSut();
    const data = { email: 'email@test.com.br', password: '' };
    const request = new HttpRequest(data);
    const response = await sut.handle(request);

    expect(response).toEqual(
      HttpResponse.badRequest('password', 'missing')
    );
  });
  it('should return a error 500 if request body is empty', async () => {
    const { sut } = makeSut();
    const data = {} as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = await sut.handle(request);

    expect(response).toEqual(HttpResponse.serverError());
  });
  it('should return a error 401 in case of use case doesnt return a token', async () => {
    const signInUseCase = {
      execute: async () =>
        new Promise<ISignInUseCaseReturn|null>((resolve, reject) =>
          resolve(null)
        ).then(x => x)
    };
    const sut = new SignInController(signInUseCase);

    const data = {
      email: 'email@teste.com.br',
      password: '12345'
    } as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = await sut.handle(request);

    expect(response).toEqual(HttpResponse.notAuthorized());
  });
  it('should call use case with correctly params', async () => {
    const signInUseCase = { execute: jest.fn() };
    const sut = new SignInController(signInUseCase);

    const data = {
      email: 'email@teste.com.br',
      password: '12345'
    } as SignInRequestDTO;
    const request = new HttpRequest(data);

    await sut.handle(request);

    expect(signInUseCase.execute).toBeCalledWith(data.email, data.password);
  });
  it('should return a error 500 in case of use case throw a error', async () => {
    const { errorSut: sut } = makeSut();

    const data = {
      email: 'email@teste.com.br',
      password: '12345'
    } as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = await sut.handle(request);

    expect(response).toEqual(HttpResponse.serverError());
  });
  it('should return a error 500 if a use case inject is undefined', async () => {
    const undefinedUseCase = {} as ISignInUseCase;
    const sut = new SignInController(undefinedUseCase);

    const data = {
      email: 'email@teste.com.br',
      password: '12345'
    } as SignInRequestDTO;
    const request = new HttpRequest(data);

    const response = await sut.handle(request);

    expect(response).toEqual(HttpResponse.serverError());
  });
});
