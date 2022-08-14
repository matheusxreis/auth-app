import { User } from 'src/auth/domain/entities/user';

export interface iSignUpMethodRepository {
    username:string;
    email:string;
    password:string
    }
export interface iSignUpRepository {
    getByEmail(email:string):Promise<User|null>;
    getByUsername(username:string):Promise<User|null>;
    signUp(params: iSignUpMethodRepository): Promise<User>
}
