import { generateAuthCode } from '../generateAuthCode';

describe('generateAuthCode', () => {
  it.each(Array.from({ length: 100 }))('should be length 6 digits #%#', () => {
    expect(generateAuthCode()).toHaveLength(6);
  });
});
