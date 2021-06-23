import * as React from "react"
import { useCallback, useEffect } from "react"
import { useState } from "react"
import { addABI, decodeLogs } from "abi-decoder";
import { Interface } from "@ethersproject/abi";
const DEXES = ["COINGECKO"];

export const eventsJson = [
  //erc20
  { "text_signature": "event Transfer(address indexed from, address indexed to, uint256 value)", },
  { "text_signature": "event Approval(address indexed owner, address indexed spender, uint256 value)", },
  //WETH
  { "text_signature": "event Deposit(address indexed dst, uint wad)", },
  { "text_signature": "event Withdrawal(address indexed src, uint wad)", },
  //IUniswapExchange
  { "text_signature": "event TokenPurchase(address indexed buyer, uint256 indexed eth_sold, uint256 indexed tokens_bought)" },
  { "text_signature": "event EthPurchase(address indexed buyer, uint256 indexed tokens_sold, uint256 indexed eth_bought)" },
  { "text_signature": "event AddLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount)" },
  { "text_signature": "event RemoveLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount)" },
  //IUniswapV2Pair
  { "text_signature": "event Mint(address indexed sender, uint amount0, uint amount1)" },
  { "text_signature": "event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)" },
  { "text_signature": "event Swap(address indexed sender, uint amount0, uint amount1, uint amount0Out, uint amount1Out, address indexed to)" },
  { "text_signature": "event Sync(uint112 reserve0, uint112 reserve1)" }
];


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


type TokenDataContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

// TODO Update
export type Token = {
  address: string
  coin: string
  logo: string
  decimals: number
}

export type Log = {

}

interface ITokenDataContextProps {
  tokens: Token[]
  getReceipts: (transaction: object) => Promise<Log[]>
}


const TokenDataContext = React.createContext<ITokenDataContextProps | undefined>(undefined)

const TokenDataProvider = ({ children }: TokenDataContextProps) => {
  const [tokens, setTokens] = useState<Token[]>([])

  const loadTokens = useCallback(async () => {
    DEXES.map(d => {
      let { tokens } = require(`./tokensList/json${d}.json`)
      console.log(tokens)
      setTokens(tokens)
    })
  }, [])
  
  const addEvents = async () => {
    eventsJson.map(async e => {
      let { text_signature } = e;
      try {
        let i = new Interface([text_signature]);
        await addABI(i.fragments);
      } catch (e) {
        console.log(e);
      }
    });
  };

  const getEthPrice = async () =>  {
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
  
    return "1";
  }

  const getAllLogs = async (_logs)  =>{
    const ethPrice = await getEthPrice();
    return decodeLogs(_logs).map(log => {
      const { coin, logo, decimals } = tokens.find(token => token.address === log.address)
      let ethValue = "0";
      let value;
      
      log.events.map(e => {
        if ((log.name == "Transfer" || log.name == "Swap") && e.type.match("uint")) {
          value = parseFloat(`${e.value / 10 ** decimals}`).toFixed(2);
          if (coin === 'WETH') {
            ethValue = parseFloat(`${value * parseFloat(ethPrice)}`).toFixed(2);
          }
        }
      });
  
      log.coin = {
        address: log.address,
        name: coin,
        event: log.name,
        logo,
        decimals,
        value,
        ethValue
      };
  
      return log;
    });
  }

  const getReceipts = useCallback(async (transaction) => {
    const jsonrpc = {
      "jsonrpc": "2.0",
      "method": "eth_getTransactionReceipt",
      "params": [],
      "id": 1
    };
  
    const params = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: ""
    };
  
    const { transaction_hash } = transaction;
    jsonrpc.params = [transaction_hash];
    params.body  = JSON.stringify(jsonrpc);
  
    try {
      const res = await fetch(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`, params);
      const { result : { logs } } = await res.json();
      return getAllLogs(logs)
    } catch(e) {
      console.log(e);
    }
  
    return []
  }, [])

  // Fetch initial
  useEffect(() => {
    addEvents()
    loadTokens()
  }, [])

  return (
    <TokenDataContext.Provider
      value={{
       tokens,
       getReceipts
      }}
    >
      {children}
    </TokenDataContext.Provider>
  )
}

const useTokenData = () => {
  const context = React.useContext(TokenDataContext)
  if (context === undefined) {
    throw new Error("useTokenData must be used within a TokenDataContextProvider")
  }
  return context
}

export { TokenDataProvider, useTokenData }
