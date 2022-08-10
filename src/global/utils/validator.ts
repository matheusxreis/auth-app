// eslint-disable-next-line no-useless-escape
const emailRegex = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";

const validatorEmail = new RegExp(emailRegex);

export class Validator {
  static isEmailValid (email:string) {
    return validatorEmail.test(email);
  }

  static isPasswordValid (password: string) {
    if (password.length > 8) { return true; }
    return false;
  }
}


