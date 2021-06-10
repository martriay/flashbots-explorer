// const USDC = {
//   "chainId": 1,
//   "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
//   "name": "USD Coin",
//   "symbol": "USDC",
//   "decimals": 6,
//   "logoURI": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389"
// };

const uniswapV2GQL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const ethQL = `{
  bundles (first:1) {
    ethPrice
  }
}`;

export async function getEthPrice() {
  const res = await fetch(uniswapV2GQL, {
    method: 'POST',
    headers: {
      'Accept': 'api_version=2',
      'Content-Type': 'application/graphql'
    },
    body: JSON.stringify({ query : ethQL })
  });

  const { data: { bundles } } = await res.json();

  if (bundles.length > 0) {
    return parseFloat(bundles[0].ethPrice).toFixed(6);
  }

  return 1;
}
