import { iSignUpUseCase, iSignUpUseCaseParams } from '../../../auth/domain/iuseCases/isignUpUseCase';
import { EmptyParamFieldError } from '../../../global/errors/EmptyParamFieldError';
import { iEncrypterEncryptRepository } from '../irepositories/iencrypterEncryptRepository';
import { iSignUpRepository } from '../irepositories/isignUpRepository';

export class SignUpUseCase implements iSignUpUseCase {
  constructor (private repository: iSignUpRepository,
    private encrypter: iEncrypterEncryptRepository) {}

  async execute (params: iSignUpUseCaseParams) {
    if (!params.email) { throw new EmptyParamFieldError('email'); }
    if (!params.password) { throw new EmptyParamFieldError('password'); }
    if (!params.username) { throw new EmptyParamFieldError('username'); }

    const emailAlreadyExist = await this.repository.getUserByEmail(params.email);
    const usernameAlreadyExist = await this.repository.getUserByUsername(params.username);

    if (emailAlreadyExist || usernameAlreadyExist) {
      return {
        username: '',
        email: '',
        _id: '',
        createdAccountAt: 2938239,
        emailAlreadyExist: !!emailAlreadyExist,
        usernameAlreadyExist: !!usernameAlreadyExist
      };
    }

    const hashPassword = await this.encrypter.encrypt(params.password);
    const rightParamsToRegister = {
      username: params.username,
      email: params.email,
      hashPassword
    };

    const userRegistered = await this.repository.signUp(rightParamsToRegister);

    return {
      username: userRegistered.username,
      email: userRegistered.email,
      _id: userRegistered._id,
      createdAccountAt: userRegistered.createdAccountAt,
      emailAlreadyExist: !!emailAlreadyExist,
      usernameAlreadyExist: !!usernameAlreadyExist
    };
  }
}
