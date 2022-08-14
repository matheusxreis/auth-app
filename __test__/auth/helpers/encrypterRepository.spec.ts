import { EncrypterRepository } from '../../../src/auth/helpers/encrypterRepository';
import bcrypt from 'bcrypt';

jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

const makeSut = () => {
  const sut = new EncrypterRepository();
  return { sut };
};

describe('EncrypterRepository', () => {
  it('should bcrypt receive correct params', async () => {
    const { sut } = makeSut();
    const passwords = ['valid.password', 'hash.password'];
    await sut.compare(passwords[0], passwords[1]);
    expect(bcrypt.compare).toBeCalledWith(passwords[0], passwords[1]);
  });
  it('should throw if password is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.compare('', 'hashPassword'))
      .rejects
      .toThrow();
  });
  it('should throw if hash password is empty', async () => {
    const { sut } = makeSut();

    expect(
      async () => await sut.compare('password', ''))
      .rejects
      .toThrow();
  });
  it('should return true if bcrypt returns true', async () => {
    const { sut } = makeSut();
    const result = await sut.compare('password', 'hashPassword');
    expect(result)
      .toBe(true);
    expect(result)
      .not.toBeNull();
  });
  it('should return false if bcrypt returns false', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
    const result = await sut.compare('password', 'hashPassword');
    expect(result)
      .toBe(false);
    expect(result)
      .not.toBeNull();
  });
});
