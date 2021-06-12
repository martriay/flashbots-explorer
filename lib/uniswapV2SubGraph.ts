// const USDC = {
//   "chainId": 1,
//   "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
//   "name": "USD Coin",
//   "symbol": "USDC",
//   "decimals": 6,
//   "logoURI": "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389"
// };

const urlArr = [
  "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
]

const ethQL = `{
  bundles (first:1) {
    ethPrice
  }
}`;
const pairQL = (_address) =>`{
   pair(id: "${_address}") {
    token0 {
      symbol
      name
    }
    token1 {
      symbol
      name
    }
  }
}`;

export async function getEthPrice() {
  const res = await fetch(urlArr[0], {
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

export async function getPairAddress(_address) {
  let c = { 
    coin: "", 
    logo: "",
    decimals: 18
  };
  const gQL = pairQL(_address);

  for (let i in urlArr) {
    let res = await fetch(urlArr[i], {
      method: 'POST',
      headers: {
        'Accept': 'api_version=2',
        'Content-Type': 'application/graphql'
      },
      body: JSON.stringify({ query : gQL })
    });

    let { data: { pair } } = await res.json();
    if(pair !== null){
      c.coin = `${pair.token0.symbol}-${pair.token1.symbol}`
      break;
    }
  }
  
  return c;
}
