import { comparePassword, hashPassword } from '../src/utils/password';

describe('password utils', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('super-secret');

    expect(hash).not.toBe('super-secret');
    await expect(comparePassword('super-secret', hash)).resolves.toBe(true);
    await expect(comparePassword('wrong-password', hash)).resolves.toBe(false);
  });
});
