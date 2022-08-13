interface UserReturnUseCase {
username: string;
id: string;
}
export interface ISignInUseCaseReturn {
user: UserReturnUseCase;
timestamp: number;
token: string;
}
export interface iSignInUseCase {
execute(email: string, password: string): Promise<ISignInUseCaseReturn | null>;
}
