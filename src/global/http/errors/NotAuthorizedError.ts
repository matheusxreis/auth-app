export class NotAuthorizedError extends Error {
  constructor () {
    super();
    this.message = 'Not authorized.';
    this.name = 'Not Authorized Error';
  }
}
