import * as crypto from 'node:crypto';

export function generateJwtSecret(): string {
  return crypto.randomBytes(64).toString('hex');
}
