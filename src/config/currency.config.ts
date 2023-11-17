import { registerAs } from '@nestjs/config';

export default registerAs('currency', () => ({
  apiUrl: process.env.CURRENCY_API_URL || '',
  apiKey: process.env.CURRENCY_API_KEY || '',
}));
