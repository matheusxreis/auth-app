import { iEncrypterCompareRepository } from '../data/irepositories/iencrypterCompareRepository';
import bcrypt from 'bcrypt';

export class EncrypterRepository implements iEncrypterCompareRepository {
  async compare (password: string, hashPassword: string): Promise<Boolean> {
    if (!password || !hashPassword) { throw new Error(); }
    return await bcrypt.compare(password, hashPassword);
  }
}
