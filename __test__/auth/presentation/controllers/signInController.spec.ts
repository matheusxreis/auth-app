
import { SignInRequestDTO } from '../../../../src/auth/presentation/dtos/SignInRequestDTO';

class BadRequestError extends Error {
  constructor (param:string) {
    super(`Missing param: ${param}.`);
    this.name = 'Bad Request: Missing Param';
  }
}

class InternalServerError extends Error {
  constructor () {
    super('Internal server error.');
    this.name = 'Internal Server Error';
  }
}

class NotAuthorizedError extends Error {
  constructor () {
    super('Not authorized.');
    this.name = 'Not Authorized Error';
  }
}
export class HttpRequest<T=any> {
  readonly body: T;
  constructor (body:T) {
    this.body = body;
  }
}
export class HttpResponse {
  static badRequest (param:string) {
    return {
      statusCode: 400,
      body: new BadRequestError(param)
    };
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new InternalServerError()
    };
  }

  static ok () {
    return {
      statusCode: 200,
      body: { message: 'OK' }
    };
  }

  static created (b:any) {
    return {
      statusCode: 201,
      body: b
    };
  }

  static notAuthorized () {
    return {
      statusCode: 401,
      body: new NotAuthorizedError()
    };
  }
}

export function isBodyEmpty (body:object) {
  return JSON.stringify(body) === JSON.stringify({});
}

export class SignInController {
  handle (req: HttpRequest<SignInRequestDTO>): HttpResponse {
    const { email, password } = req.body;
    const bodyEmpty = isBodyEmpty(req.body);
    if (bodyEmpty) { return HttpResponse.serverError(); }
    if (!email) { return HttpResponse.badRequest('email'); }
    if (!password) { return HttpResponse.badRequest('password'); }

    return HttpResponse.ok();
  }
}

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
