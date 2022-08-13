export interface iGenerateTokenRepository {
    generate(userId: string):Promise<string>
}
