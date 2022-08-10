import { SignInResponseDTO } from '../../dtos/SignInResponseDTO';

export interface IAuthRepository {
    signIn(email:string, password:string):Promise<SignInResponseDTO|null>;
    signUp():void;
}
