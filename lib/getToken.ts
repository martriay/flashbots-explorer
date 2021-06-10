const DEXES = ["COINGECKO"];

let tokensList = [];
async function getTokens() {
  DEXES.map(d => {
    let { tokens } = require(`../tokensList/json${d}.json`)
    tokensList.push(tokens);
  })
}

getTokens();

export function getToken(_address: string) {
  let c = { 
    coin: "", 
    logo: "",
    decimals: 18
  };

  for (let d in tokensList) {
    for (let t in tokensList[d]) {
      let o = tokensList[d][t];
      if (o.address === _address) {
        c.coin = o.symbol;
        c.logo = o.logoURI ? o.logoURI : "";
        c.decimals = o.decimals ? o.decimals : 0;
        break;
      } 
    }

    if (c.coin !== "") {
      break;
    }
  }
  return c;
}
