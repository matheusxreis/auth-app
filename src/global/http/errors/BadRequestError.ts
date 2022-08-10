export class BadRequestMissingParamError extends Error {
  constructor (param: string) {
    super(`Missing param: ${param}.`);
    this.name = 'Bad Request: Missing Param';
  }
}

export class BadRequestInvalidParam extends Error {
  constructor (param: string) {
    super(`Invalid param: ${param}.`);
    this.name = 'Bad Request: Invalid Param';
  }
}
