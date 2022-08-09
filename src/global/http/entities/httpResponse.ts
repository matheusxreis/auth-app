import { BadRequestInvalidParam, BadRequestMissingParamError } from '../errors/BadRequestError';
import { InternalServerError } from '../errors/InternalServerError';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

type BadRequestType = 'missing' | 'invalid'
export class HttpResponse {
  readonly body: any;
  static badRequest (param:string, type:BadRequestType = 'missing') {
    return {
      statusCode: 400,
      body: type === 'missing'
        ? new BadRequestMissingParamError(param)
        : new BadRequestInvalidParam(param)
    };
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new InternalServerError()
    };
  }

  static ok (body?:object) {
    return {
      statusCode: 200,
      body: body || { message: 'OK' }
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
