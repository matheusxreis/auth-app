import { iSignInUseCase, ISignInUseCaseReturn } from 'src/auth/domain/iuseCases/isignInUseCase';
import { EmptyParamFieldError } from '../../../global/errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../../global/errors/InvalidInjectionError';
import { iEncrypterCompareRepository } from '../irepositories/iencrypterCompareRepository';
import { iGenerateTokenRepository } from '../irepositories/igenerateTokenRepository';
import { iGetByEmailRepository } from '../irepositories/igetByEmailRepository';

export class SignInUseCase implements iSignInUseCase {
  constructor (private getByEmailRepository: iGetByEmailRepository,
              private encrypter: iEncrypterCompareRepository,
              private generateToken: iGenerateTokenRepository) {}

  async execute (email: string, password: string): Promise<ISignInUseCaseReturn|null> {
    if (!email) {
      throw new EmptyParamFieldError('email');
    }
    if (!password) {
      throw new EmptyParamFieldError('password');
    }
    if (!this.getByEmailRepository.getUserByEmail) {
      throw new InvalidInjectionError(
        'AuthRepository must has a signIn method',
        'SignInUseCase'
      );
    }
    const userData = await this.getByEmailRepository.getUserByEmail(email);
    if (!userData) { return null; }
    const isPasswordRight = await this.encrypter.compare(password, String(userData?.hashPassword));
    if (!isPasswordRight) { return null; }

    const token = await this.generateToken.generate(userData.id);

    if (!token) { throw new Error(); }
    const user = {
      username: userData.username,
      id: userData.id
    };
    return {
      user,
      timestamp: new Date().getTime(),
      token
    };
  }
}
