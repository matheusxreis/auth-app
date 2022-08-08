import { sum, isUppercase } from '../src';

it('should sum two differents number', () => {
  expect(sum(6, 8)).toBe(14);
});

it('should verify if a word is on uppercase correctly', () => {
  expect(isUppercase('hey')).toBe('The word is not on uppercase... =(');
});
