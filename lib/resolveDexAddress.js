//resolveDexAddress

const dexs = ["COINGECKO"];

let tokensList = [];
const getTokens = async (_address) => {
  dexs.map(d => {
    let { tokens } = require(`../tokensList/json${d}.json`)
    tokensList.push(tokens);
  })
}
getTokens();

// setTimeout(()=> getDexAddress('0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'), 2000 );  
// setTimeout(()=> getDexAddress('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'), 2000 );  

export function getDexAddress(_address) {
  let c = { 
    coin: "", 
    logo: ""
  };
  for(let d in tokensList ) {
    for( let t in tokensList[d] ){
      let o = tokensList[d][t];
      if(o.address == _address) {
        c.coin = o.symbol;
        c.logo = o.logoURI ? o.logoURI : "";
        break;
      } 
    }
    if(c != "") break;
  }
  return c;
}
