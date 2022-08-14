import { iEncrypterCompareRepository } from '../data/irepositories/iencrypterCompareRepository';
import bcrypt from 'bcrypt';
import { iEncrypterEncryptRepository } from '../data/irepositories/iencrypterEncryptRepository';

export class EncrypterRepository implements iEncrypterCompareRepository, iEncrypterEncryptRepository {
  async compare (password: string, hashPassword: string): Promise<Boolean> {
    if (!password || !hashPassword) { throw new Error(); }
    return await bcrypt.compare(password, hashPassword);
  }

  async encrypt (password:string): Promise <string> {
    if (!password) { throw new Error(); }
    return await bcrypt.hash(password, 8);
  }
}
