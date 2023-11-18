import { registerAs } from '@nestjs/config';

export default registerAs('currencies', () => ({
  apiUrl: process.env.CURRENCY_API_URL || '',
  apiKey: process.env.CURRENCY_API_KEY || '',
}));
