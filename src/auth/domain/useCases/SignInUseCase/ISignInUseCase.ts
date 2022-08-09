interface UserReturnUseCase {
username: string,
id:string,
};
interface IReturnUseCase {
user: UserReturnUseCase,
timestamp: number,
token: string
};
export interface ISignInUseCase {
execute(email:string, password:string):IReturnUseCase;
};
