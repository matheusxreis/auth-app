export class InvalidInjectionError extends Error {
  constructor (message: string, component: string) {
    super();
    this.message = message;
    this.name = `InvalidInjectionError: Verify your component: ${component}.`;
  }
}
