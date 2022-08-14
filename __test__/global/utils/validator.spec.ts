import { Validator } from '../../../src/global/utils/validator';

const sut = new Validator();

describe('Validator Class', () => {
  it('should return true if a email is valid', () => {
    const email = 'valid.email@gmail.com';
    const isEmailValid = sut.isEmailValid(email);

    expect(isEmailValid).toBe(true);
  });
  it('should return false if a email is not valid', () => {
    const email = 'invalid.email.com';
    const isEmailValid = sut.isEmailValid(email);

    expect(isEmailValid).toBe(false);
  });
  it('should return true if a password has 9 or more characteres', () => {
    const password = '123456789';
    const isPasswordValid = sut.isPasswordValid(password);

    expect(isPasswordValid).toBe(true);
  });
  it('should return false if a password has 8 or less characteres', () => {
    const password = '12345678';
    const isPasswordValid = sut.isPasswordValid(password);

    expect(isPasswordValid).toBe(false);
  });
  it('should call method isEmailValid with correct email', () => {
    let rightEmail = '';
    const mockedEmailValidator = jest.spyOn(sut, 'isEmailValid').mockImplementation((email) => { rightEmail = email; return true; });

    const email = 'valid.email@gmail.com';
    sut.isEmailValid(email);

    expect(rightEmail).toBe(email);
    mockedEmailValidator.mockRestore();
  });
  it('should call method isPasswordValid with correct password', () => {
    let rightPassword = '';
    const mockedPasswordValidator = jest.spyOn(sut, 'isPasswordValid').mockImplementation((pass) => { rightPassword = pass; return true; });

    const password = '123456789@';
    sut.isPasswordValid(password);

    expect(rightPassword).toBe(password);
    mockedPasswordValidator.mockRestore();
  });
});
