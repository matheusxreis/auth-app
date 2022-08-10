export class HttpRequest<T = any> {
  readonly body: T;
  constructor (body: T) {
    this.body = body;
  }
}
