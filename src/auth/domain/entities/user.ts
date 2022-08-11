export class User {
  constructor (
        readonly name: string,
        readonly email: string,
        readonly hashPassword: string,
        readonly createdAccountAt: number

  ) {}
}
