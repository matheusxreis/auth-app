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
    await this.authRepository;
    await bcrypt.compare(password, 'a');
    return await this.authRepository.signIn(email, password);
  }
}