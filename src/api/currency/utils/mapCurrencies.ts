export function mapCurrencies(currencies: Record<string, any>) {
  return Object.keys(currencies.data).map((key) => ({
    symbol: currencies.data[key].code === 'RUB' ? '₽' : currencies.data[key].symbol,
    name: currencies.data[key].name,
    code: currencies.data[key].code,
  }));
}
