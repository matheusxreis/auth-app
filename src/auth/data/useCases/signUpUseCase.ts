import { iSignUpUseCase, iSignUpUseCaseParams } from '../../../auth/domain/iuseCases/isignUpUseCase';
import { EmptyParamFieldError } from '../../../global/errors/EmptyParamFieldError';
import { iEncrypterEncryptRepository } from '../irepositories/iencrypterEncryptRepository';
import { iSignUpRepository } from '../irepositories/isignUpRepository';

export class SignUpUseCase implements iSignUpUseCase {
  constructor (private repository: iSignUpRepository,
    encrypter: iEncrypterEncryptRepository) {}

  async execute (params: iSignUpUseCaseParams) {
    if (!params.email) { throw new EmptyParamFieldError('email'); }
    if (!params.password) { throw new EmptyParamFieldError('password'); }
    if (!params.username) { throw new EmptyParamFieldError('username'); }

    const emailAlreadyExist = await this.repository.getByEmail(params.email);
    const usernameAlreadyExist = await this.repository.getByUsername(params.username);

    if (emailAlreadyExist || usernameAlreadyExist) {
      return {
        username: '',
        email: '',
        id: '',
        createdAccountAt: 2938239,
        emailAlreadyExist: !!emailAlreadyExist,
        usernameAlreadyExist: !!usernameAlreadyExist
      };
    }

    const userRegistered = await this.repository.signUp(params);

    return {
      username: userRegistered.username,
      email: userRegistered.email,
      id: userRegistered.id,
      createdAccountAt: userRegistered.createdAccountAt,
      emailAlreadyExist: !!emailAlreadyExist,
      usernameAlreadyExist: !!usernameAlreadyExist
    };
  }
}
