import { SignInResponseDTO } from '../../presentation/dtos/SignInResponseDTO';

export interface IAuthRepository {
    signIn(email:string, password:string):Promise<SignInResponseDTO>;
    signUp():void;
}
