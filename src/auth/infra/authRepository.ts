import { iGetByEmailRepository } from '../data/irepositories/igetByEmailRepository';
import { User } from '../domain/entities/user';
import { Model } from 'mongoose';
import { iSignUpMethodRepository, iSignUpRepository } from '../data/irepositories/isignUpRepository';

export class AuthRepository implements iGetByEmailRepository, iSignUpRepository {
  constructor (private Model: Model<any>) {}

  async getUserByUsername (username: string): Promise<User | null> {
    const user = await this.Model.findOne({ username });
    return user as User;
  }

  async signUp (params: iSignUpMethodRepository): Promise<User> {
    const newUser = new this.Model({ ...params, createdAccountAt: new Date().getTime() })
      .save();

    return newUser;
  }

  async getUserByEmail (email: string): Promise<User | null> {
    const user = await this.Model.findOne({ email });
    return user as User;
  }
}
