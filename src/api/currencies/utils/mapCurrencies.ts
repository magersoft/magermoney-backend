import { CurrencyEntity } from '@/api/currencies/entities/currency.entity';

export function mapCurrencies(currencies: Record<string, any>): Omit<CurrencyEntity, 'id'>[] {
  return Object.keys(currencies.data).map((key) => ({
    symbol: currencies.data[key].code === 'RUB' ? '₽' : currencies.data[key].symbol,
    name: currencies.data[key].name,
    code: currencies.data[key].code,
  }));
}
