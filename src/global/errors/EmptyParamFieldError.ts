export class EmptyParamFieldError extends Error {
  constructor (param: string) {
    super();
    this.message = `Missing param: ${param}.`;
    this.name = 'EmptyParamField(dev): Missing Param';
  }
}
