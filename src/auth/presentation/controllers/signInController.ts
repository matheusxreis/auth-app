import { iSignInUseCase } from 'src/auth/domain/iuseCases/isignInUseCase';
import { HttpRequest } from '../../../global/http/entities/httpRequest';
import { HttpResponse } from '../../../global/http/entities/httpResponse';
import { isBodyEmpty } from '../../../global/http/helpers/isBodyEmpty';
import { SignInRequestDTO } from '../dtos/SignInRequestDTO';
import { iValidator } from '../iutils/ivalidator';

export class SignInController {
  constructor (private useCase: iSignInUseCase,
            private validator: iValidator) {}

  async handle (req: HttpRequest<SignInRequestDTO>): Promise<HttpResponse> {
    const { email, password } = req.body;
    const bodyEmpty = isBodyEmpty(req.body);
    if (bodyEmpty) {
      return HttpResponse.serverError();
    }
    if (!email) {
      return HttpResponse.badRequest('email');
    }
    if (!password) {
      return HttpResponse.badRequest('password');
    }

    if (!this.validator.isEmailValid(email)) {
      return HttpResponse.badRequest('email', 'invalid');
    }

    try {
      const response = await this.useCase.execute(email, password);
      if (!response?.token) {
        return HttpResponse.notAuthorized();
      }
      return HttpResponse.ok(response);
    } catch {
      return HttpResponse.serverError();
    }
  }
}
