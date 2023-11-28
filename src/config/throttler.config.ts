import { registerAs } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: process.env.APP_THROTTLE_TTL || 60,
  limit: process.env.APP_THROTTLE_LIMIT || 100,
}));
