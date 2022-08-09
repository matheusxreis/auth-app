import { BadRequestError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

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
