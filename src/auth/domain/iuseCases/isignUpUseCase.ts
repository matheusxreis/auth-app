
export interface iSignUpUseCaseParams {
username: string,
email: string,
password: string
}

interface iSignUpUseCaseResponse {
username: string,
email: string,
createdAccountAt: number,
_id: string
emailAlreadyExist: boolean,
usernameAlreadyExist: boolean
}
export interface iSignUpUseCase {
    execute(params: iSignUpUseCaseParams): Promise<iSignUpUseCaseResponse>;
}
