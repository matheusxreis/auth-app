import { EncrypterRepository } from '../../../src/auth/helpers/encrypterRepository';
import bcrypt from 'bcrypt';

jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'A67GAUA28G2K2827H2');

const makeSut = () => {
  const sut = new EncrypterRepository();
  return { sut };
};

describe('EncrypterRepository', () => {
  it('should bcrypt compare method receive correct params', async () => {
    const { sut } = makeSut();
    const passwords = ['valid.password', 'hash.password'];
    await sut.compare(passwords[0], passwords[1]);
    expect(bcrypt.compare).toBeCalledWith(passwords[0], passwords[1]);
  });
  it('should throw if password in compare method is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.compare('', 'hashPassword'))
      .rejects
      .toThrow();
  });
  it('should throw if hash password in compare method is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.compare('password', ''))
      .rejects
      .toThrow();
  });
  it('should compare method return true if bcrypt compare method returns true', async () => {
    const { sut } = makeSut();
    const result = await sut.compare('password', 'hashPassword');
    expect(result)
      .toBe(true);
    expect(result)
      .not.toBeNull();
  });
  it('should compare method return false if bcrypt compare method returns false', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
    const result = await sut.compare('password', 'hashPassword');
    expect(result)
      .toBe(false);
    expect(result)
      .not.toBeNull();
  });
  it('should bcrypt hash method receive correct params', async () => {
    const { sut } = makeSut();
    const password = '123456789*';
    await sut.encrypt(password);

    expect(bcrypt.hash).toBeCalledWith(password, 8);
  });
  it('should throw if password in encrypt method is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.encrypt(''))
      .rejects
      .toThrow();
  });
  it('should encrypt method return a string hash', async () => {
    const { sut } = makeSut();
    const bcryptResult = await bcrypt.hash('password', 8);
    const response = await sut.encrypt('password');

    expect(response).toBe(bcryptResult);
    expect(typeof response).toBe('string');
    expect(response).not.toBeNull();
  });
});
