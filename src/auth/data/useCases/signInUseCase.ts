import { EmptyParamFieldError } from '../errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../errors/InvalidInjectionError';
import { iEncrypterRepository } from '../irepositories/iencrypterRepository';
import { iGenerateTokenRepository } from '../irepositories/igenerateTokenRepository';
import { iGetByEmailRepository } from '../irepositories/igetByEmailRepository';

export class SignInUseCase {
  constructor (private getByEmailRepository: iGetByEmailRepository,
              private encrypter: iEncrypterRepository,
              private generateToken: iGenerateTokenRepository) {}

  async execute (email: string, password: string) {
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
      username: userData.name,
      id: userData.id
    };
    return {
      user,
      timestap: new Date().getTime(),
      token
    };
  }
}
