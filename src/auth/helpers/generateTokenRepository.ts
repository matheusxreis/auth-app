import { iGenerateTokenRepository } from '../data/irepositories/igenerateTokenRepository';
import { sign } from 'jsonwebtoken';
import { EmptyParamFieldError } from '../../global/errors/EmptyParamFieldError';

export class GenerateTokenRepository implements iGenerateTokenRepository {
  readonly jwtSecret = 'AJ823H2H282K2j82K2H7I';
  async generate (userId: string): Promise<string> {
    if (!userId) { throw new EmptyParamFieldError('userId'); }
    return sign({}, this.jwtSecret, { subject: userId, expiresIn: '1d' });
  }
}
