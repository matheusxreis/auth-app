export class BadRequestError extends Error {
  constructor (param:string) {
    super(`Missing param: ${param}.`);
    this.name = 'Bad Request: Missing Param';
  }
}
