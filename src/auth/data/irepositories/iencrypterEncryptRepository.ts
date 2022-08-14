
export interface iEncrypterEncryptRepository {
    encrypt(password:string):Promise<string>
}
