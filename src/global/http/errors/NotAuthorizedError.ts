export class NotAuthorizedError extends Error {
  constructor () {
    super('Not authorized.');
    this.name = 'Not Authorized Error';
  }
}
