export class EmptyParamFieldError extends Error {
  constructor (param:string) {
    super(`Missing param: ${param}.`);
    this.name = 'EmptyParamField(dev): Missing Param';
  }
}
