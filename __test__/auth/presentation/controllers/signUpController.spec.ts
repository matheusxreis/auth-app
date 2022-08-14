import { iValidator } from '../../../../src/auth/presentation/iutils/ivalidator';
import { HttpRequest } from '../../../../src/global/http/entities/httpRequest';
import { HttpResponse } from '../../../../src/global/http/entities/httpResponse';
import { iSignUpUseCase } from '../../../../src/auth/domain/iuseCases/isignUpUseCase';

export interface ISignUpRequestDTO {
username:string;
email:string;
password:string;
}

class SignUpController {
  constructor (
      private signUpUseCase: iSignUpUseCase,
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

    try {
      const user = await this.signUpUseCase.execute({ username, email, password });
      if (user.emailAlreadyExist) { return HttpResponse.badRequestDataAlreadyExist('E-mail'); }
      if (user.usernameAlreadyExist) { return HttpResponse.badRequestDataAlreadyExist('Username'); }
      return HttpResponse.created({ user });
    } catch {
      return HttpResponse.serverError();
    }
  }
}

const makeSut = () => {
  const validator = {
    isEmailValid: jest.fn().mockImplementation(() => true),
    isPasswordValid: jest.fn().mockImplementation(() => true)
  };
  const useCase = {
    execute: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve({
      name: 'username',
      email: 'email',
      createdAccountAt: new Date().getTime(),
      id: '92j27g2j27h2'
    })))
  };
  const errorUseCase = {
    execute: () => { throw new Error(); }
  };
  const errorSut = new SignUpController(errorUseCase, validator);
  const sut = new SignUpController(useCase, validator);

  return { sut, validator, useCase, errorSut };
};
const params = {
  username: 'username',
  email: 'valid.email@gmail.com',
  password: '12345678'
};
const req = new HttpRequest(params);

describe('SignUpController', () => {
  it('should return a 400 if email is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: '',
      password: 'a*valid@password'
    };
    const invalidReq = new HttpRequest(params);
    expect(await sut.handle(invalidReq)).toEqual(HttpResponse.badRequest('email'));
  });
  it('should return a 400 if username is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: '',
      email: 'validemail@gmail.com',
      password: 'a*valid@password'
    };
    const invalidReq = new HttpRequest(params);
    expect(await sut.handle(invalidReq)).toEqual(HttpResponse.badRequest('username'));
  });
  it('should return a 400 if password is empty', async () => {
    const { sut } = makeSut();
    const params = {
      username: 'username',
      email: 'validemail@gmail.com',
      password: ''
    };
    const invalidReq = new HttpRequest(params);
    expect(await sut.handle(invalidReq)).toEqual(HttpResponse.badRequest('password'));
  });
  it('should isEmailValid method from validator receive right email', async () => {
    const { sut, validator } = makeSut();

    await sut.handle(req);
    expect(validator.isEmailValid).toBeCalledWith(params.email);
  });
  it('should isPasswordValid method from validator receive right email', async () => {
    const { sut, validator } = makeSut();

    await sut.handle(req);
    expect(validator.isPasswordValid).toBeCalledWith(params.password);
  });
  it('should return a 400 if email is invalid', async () => {
    const { useCase } = makeSut();
    const validator = {
      isEmailValid: jest.fn().mockImplementation(() => false),
      isPasswordValid: jest.fn().mockImplementation(() => true)
    };
    const sut = new SignUpController(useCase, validator);
    const params = {
      username: 'username',
      email: 'invalidemail.com',
      password: '*178267*¨1h1j*'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('email', 'invalid'));
  });
  it('should return a 400 if password is invalid', async () => {
    const { useCase } = makeSut();

    const validator = {
      isEmailValid: jest.fn().mockImplementation(() => true),
      isPasswordValid: jest.fn().mockImplementation(() => false)
    };
    const sut = new SignUpController(useCase, validator);
    const params = {
      username: 'username',
      email: 'valid.email@gmail.com',
      password: '12345678'
    };
    const req = new HttpRequest(params);
    expect(await sut.handle(req)).toEqual(HttpResponse.badRequest('password', 'invalid'));
  });
  it('should useCase receive right params', async () => {
    const { sut, useCase } = makeSut();

    await sut.handle(req);

    expect(useCase.execute).toBeCalledWith(req.body);
  });
  it('should return a 201 response if all is ok', async () => {
    const { sut, useCase } = makeSut();

    const response = await sut.handle(req);
    const user = await useCase.execute();

    expect(response).toEqual(HttpResponse.created({ user }));
  });
  it('should return 400 if email is already registered', async () => {
    const { validator } = makeSut();
    const useCase = {
      execute: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve({
        emailAlreadyExist: true,
        usernameAlreadyExist: false
      })))
    };
    const sut = new SignUpController(useCase, validator);
    const response = await sut.handle(req);

    expect(response).toEqual(HttpResponse.badRequestDataAlreadyExist('E-mail'));
  });
  it('should return 400 if username is already registered', async () => {
    const { validator } = makeSut();
    const useCase = {
      execute: jest.fn().mockImplementation(async () => await new Promise((resolve, reject) => resolve({
        emailAlreadyExist: false,
        usernameAlreadyExist: true
      })))
    };
    const sut = new SignUpController(useCase, validator);
    const response = await sut.handle(req);

    expect(response).toEqual(HttpResponse.badRequestDataAlreadyExist('Username'));
  });
  it('should return a serverError if use case throws', async () => {
    const { errorSut: sut } = makeSut();

    const response = await sut.handle(req);

    expect(response).toEqual(HttpResponse.serverError());
  });
});
