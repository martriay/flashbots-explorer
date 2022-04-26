const cryptoApi = _symbol => `https://min-api.cryptocompare.com/data/price?fsym=${_symbol}&tsyms=USD`;

export async function getUSDPrice(sym) {
  const res = await fetch(cryptoApi(sym));

  const result = await res.json();

  if (result.USD > 0) {
    return parseFloat(result.USD).toFixed(2);
  }

  return 0;
}