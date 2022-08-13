import { User } from '../../domain/entities/user';

export interface iGetByEmailRepository {
    getUserByEmail(email:string):Promise<User|null>
}
