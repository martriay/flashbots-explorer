import { addABI, decodeLogs } from "abi-decoder";
import { Interface } from "@ethersproject/abi";
import { formatEther } from "@ethersproject/units";
import { getDexAddress } from "./resolveDexAddress"; 
import { getEthPrice } from "./uniswapV2SubGraph"; 

const eventsJson = [
    //erc20
    {
      "text_signature": "event Transfer(address indexed from, address indexed to, uint256 value)",
    },
    {
      "text_signature": "event Approval(address indexed owner, address indexed spender, uint256 value)",
    },
    //WETH
    {
      "text_signature": "event Deposit(address indexed dst, uint wad)",
    },
    {
      "text_signature": "event Withdrawal(address indexed src, uint wad)",
    },
    //IUniswapExchange
    {
      "text_signature": "event TokenPurchase(address indexed buyer, uint256 indexed eth_sold, uint256 indexed tokens_bought)"
    },
    {
      "text_signature": "event EthPurchase(address indexed buyer, uint256 indexed tokens_sold, uint256 indexed eth_bought)"
    },
    {
      "text_signature": "event AddLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount)"
    },
    {
      "text_signature": "event RemoveLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount)"
    },
    //IUniswapV2Pair
    {
      "text_signature": "event Mint(address indexed sender, uint amount0, uint amount1)"
    },
    {
      "text_signature": "event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)"
    },
    {
      "text_signature": "event Swap(address indexed sender, uint amount0, uint amount1, uint amount0Out, uint amount1Out, address indexed to)"
    },
    {
      "text_signature": "event Sync(uint112 reserve0, uint112 reserve1)"
    }
]

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
}

addEvents();

export async function getAllLogs(_logs) {
  const ethPrice = await getEthPrice();
  return decodeLogs(_logs).map(log => {
    let { coin, logo, decimals } = getDexAddress(log.address)
    let value = 0;
    let ethValue = 0;
    
    log.events.map(e => {
      if( (log.name == "Transfer" || log.name == "Swap") && e.type.match("uint")){
        
        if(decimals >= 18 ){
          value = parseFloat(formatEther(e.value)).toFixed(6);
        } else {
          value = parseFloat(e.value/10**decimals).toFixed(6);
        }

        if(coin == 'WETH')
          ethValue = parseFloat(value*ethPrice).toFixed(2);
      }
    })
    log.coin = {
      address: log.address,
      name: coin,
      logo,
      decimals,
      value,
      ethValue
    };
    if(log.name == "Transfer" || log.name == "Swap") console.log(log);
    return log
  });
}
