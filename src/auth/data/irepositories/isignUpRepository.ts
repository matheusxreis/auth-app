import { User } from 'src/auth/domain/entities/user';

export interface iSignUpMethodRepository {
    username:string;
    email:string;
    hashPassword:string
    }
export interface iSignUpRepository {
    getUserByEmail(email:string):Promise<User|null>;
    getUserByUsername(username:string):Promise<User|null>;
    signUp(params: iSignUpMethodRepository): Promise<User>
}
