import { ISignInUseCase } from 'src/auth/domain/useCases/SignInUseCase/ISignInUseCase';
import { HttpRequest } from '../../../global/http/entities/httpRequest';
import { HttpResponse } from '../../../global/http/entities/httpResponse';
import { isBodyEmpty } from '../../../global/http/helpers/isBodyEmpty';
import { SignInRequestDTO } from '../dtos/SignInRequestDTO';

export class SignInController {
  constructor (private useCase:ISignInUseCase) {}

  handle (req: HttpRequest<SignInRequestDTO>): HttpResponse {
    const { email, password } = req.body;
    const bodyEmpty = isBodyEmpty(req.body);
    if (bodyEmpty) { return HttpResponse.serverError(); }
    if (!email) { return HttpResponse.badRequest('email'); }
    if (!password) { return HttpResponse.badRequest('password'); }

    try {
      this.useCase.execute(email, password);
      return HttpResponse.ok();
    } catch {
      return HttpResponse.notAuthorized();
    }
  }
}
