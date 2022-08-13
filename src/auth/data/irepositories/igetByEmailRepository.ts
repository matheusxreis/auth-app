import { User } from '../../domain/entities/user';

export interface IGetByEmailRepository {
    getUserByEmail(email:string):Promise<User|null>
}
