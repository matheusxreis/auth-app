export class InternalServerError extends Error {
  constructor () {
    super();
    this.message = 'Internal server error.';
    this.name = 'Internal Server Error';
  }
}
