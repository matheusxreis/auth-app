import { iSignUpUseCase } from '../../domain/iuseCases/isignUpUseCase';
import { HttpRequest } from '../../../global/http/entities/httpRequest';
import { HttpResponse } from '../../../global/http/entities/httpResponse';
import { SignUpRequestDTO } from '../dtos/SignUpRequestDTO';
import { iValidator } from '../iutils/ivalidator';

export class SignUpController {
  constructor (
        private signUpUseCase: iSignUpUseCase,
        private validator: iValidator
  ) {}

  async handle (req: HttpRequest<SignUpRequestDTO>) {
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
      const newUser = {
        username: user.username,
        id: user._id,
        email: user.email
      };
      return HttpResponse.created({ user: newUser });
    } catch {
      return HttpResponse.serverError();
    }
  }
}
