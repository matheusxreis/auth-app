import { EmptyParamFieldError } from '../errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../errors/InvalidInjectionError';
import { iEncrypterRepository } from '../irepositories/iencrypterRepository';
import { IGetByEmailRepository } from '../irepositories/igetByEmailRepository';

export class SignInUseCase {
  constructor (private getByEmailRepository: IGetByEmailRepository,
              private encrypter: iEncrypterRepository) {}

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

    const user = {
      username: userData.name,
      id: userData.id
    };
    return {
      user,
      timestap: 12345,
      token: 'access_token'
    };
  }
}
