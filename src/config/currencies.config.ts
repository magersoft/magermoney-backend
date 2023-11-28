import { registerAs } from '@nestjs/config';

export default registerAs('currencies', () => ({
  apiUrl: process.env.CURRENCY_API_URL || '',
  apiKey: process.env.CURRENCY_API_KEY || '',
  rateTTL: process.env.CURRENCY_API_RATE_TTL || 3600,
  currenciesEndpoint: process.env.CURRENCY_API_CURRENCIES_ENDPOINT || '/currencies',
  ratesEndpoint: process.env.CURRENCY_API_RATES_ENDPOINT || '/latest',
}));
