export function isBodyEmpty (body: object) {
  return JSON.stringify(body) === JSON.stringify({});
}
