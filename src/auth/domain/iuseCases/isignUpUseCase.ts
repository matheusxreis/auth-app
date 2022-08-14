import { User } from '../entities/user';

interface iSignUpUseCaseParams {
username: string,
email: string,
password: string
}

export interface iSignUpUseCase {
    execute(params: iSignUpUseCaseParams): Promise<User | null>;
}
