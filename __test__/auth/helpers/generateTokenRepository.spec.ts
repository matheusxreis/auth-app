import { GenerateTokenRepository } from '../../../src/auth/helpers/generateTokenRepository';
import { verify } from 'jsonwebtoken';
import { EmptyParamFieldError } from '../../../src/global/errors/EmptyParamFieldError';

const makeSut = () => {
  const sut = new GenerateTokenRepository();
  return { sut };
};
describe('GenerateTokenRepository', () => {
  it('should sign from jwt receive correcty userId', async () => {
    const { sut } = makeSut();
    const userId = '1239*userID';
    const result = await sut.generate(userId);

    const idFromToken = verify(result, sut.jwtSecret);
    expect(idFromToken.sub).toBe(userId);
  });
  it('should return a string access token', async () => {
    const { sut } = makeSut();

    const result = await sut.generate('userId');
    expect(typeof result).toBe('string');
  });
  it('should throw null if userId param is empty', async () => {
    const { sut } = makeSut();

    expect(async () => await sut.generate(''))
      .rejects
      .toThrow(new EmptyParamFieldError('userId'));
  });
});
