
export interface iEncrypterRepository {
    compare(password:string, hashPassword:string):Promise<Boolean>
}
