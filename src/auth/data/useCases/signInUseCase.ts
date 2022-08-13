import bcrypt from 'bcrypt';
import { EmptyParamFieldError } from '../errors/EmptyParamFieldError';
import { InvalidInjectionError } from '../errors/InvalidInjectionError';
import { IGetByEmailRepository } from '../irepositories/getByEmailRepository';

export class SignInUseCase {
  constructor (private getByEmailRepository: IGetByEmailRepository) {}

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
    const isPasswordRight = await bcrypt.compare(password, String(userData?.hashPassword));
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
