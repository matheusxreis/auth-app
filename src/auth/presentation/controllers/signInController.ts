import { ISignInUseCase } from 'src/auth/domain/useCases/SignInUseCase/ISignInUseCase';
import { HttpRequest } from '../../../global/http/entities/httpRequest';
import { HttpResponse } from '../../../global/http/entities/httpResponse';
import { isBodyEmpty } from '../../../global/http/helpers/isBodyEmpty';
import { SignInRequestDTO } from '../dtos/SignInRequestDTO';
import { SignInResponseDTO } from '../dtos/SignInResponseDTO';

export class SignInController {
  constructor (private useCase:ISignInUseCase) {}

  async handle (req: HttpRequest<SignInRequestDTO>): Promise<HttpResponse> {
    const { email, password } = req.body;
    const bodyEmpty = isBodyEmpty(req.body);
    if (bodyEmpty) { return HttpResponse.serverError(); }
    if (!email) { return HttpResponse.badRequest('email'); }
    if (!password) { return HttpResponse.badRequest('password'); }

    try {
      const response: SignInResponseDTO = await this.useCase.execute(email, password);
      if (!response.token) { return HttpResponse.notAuthorized(); }
      return HttpResponse.ok(response);
    } catch {
      return HttpResponse.serverError();
    }
  }
}
