
export interface iEncrypterCompareRepository {
    compare(password:string, hashPassword:string):Promise<Boolean>
}
