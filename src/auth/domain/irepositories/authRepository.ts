import { SignInResponseDTO } from '../../dtos/SignInResponseDTO';
import { User } from '../entities/user';

export interface IAuthRepository {
signIn(email: string, password: string): Promise<SignInResponseDTO | null>;
signUp(): void;
getUserByEmail(email:string):Promise<User|null>
}
