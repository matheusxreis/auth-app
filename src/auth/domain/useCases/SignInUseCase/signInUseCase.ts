import { EmptyParamFieldError } from '../../errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../../errors/InvalidInjectionError';
import { IAuthRepository } from '../../irepositories/authRepository';
import bcrypt from 'bcrypt';

export class SignInUseCase {
  constructor (private authRepository: IAuthRepository) {}

  async execute (email: string, password: string) {
    if (!email) {
      throw new EmptyParamFieldError('email');
    }
    if (!password) {
      throw new EmptyParamFieldError('password');
    }
    if (!this.authRepository.signIn) {
      throw new InvalidInjectionError(
        'AuthRepository must has a signIn method',
        'SignInUseCase'
      );
    }
    const userData = await this.authRepository.getUserByEmail(email);
    if (!userData) { return null; }
    const isPasswordRight = await bcrypt.compare(password, String(userData?.hashPassword));
    if (!isPasswordRight) { return null; }

    const user = {
      username: userData.name,
      id: userData.id
    };
    return {
      user,
      timestap: 123456,
      token: 'access_token'
    };
  }
}
