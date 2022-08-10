import { Validator } from '../../../src/global/utils/validator';

describe('Validator Class', () => {
  it('should return true if a email is valid', () => {
    const email = 'valid.email@gmail.com';
    const isEmailValid = Validator.isEmailValid(email);

    expect(isEmailValid).toBe(true);
  });
  it('should return false if a email is not valid', () => {
    const email = 'invalid.email.com';
    const isEmailValid = Validator.isEmailValid(email);

    expect(isEmailValid).toBe(false);
  });
  it('should return true if a password has 9 or more characteres', () => {
    const password = '123456789';
    const isPasswordValid = Validator.isPasswordValid(password);

    expect(isPasswordValid).toBe(true);
  });
  it('should return false if a password has 8 or less characteres', () => {
    const password = '12345678';
    const isPasswordValid = Validator.isPasswordValid(password);

    expect(isPasswordValid).toBe(false);
  });
});
