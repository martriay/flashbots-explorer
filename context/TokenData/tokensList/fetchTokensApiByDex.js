const fs = require('fs');

const dexUrl = {
  'COINGECKO': "https://tokens.coingecko.com/uniswap/all.json"
};

const tokensBySymbol = {}

const readFiles = async dex => {
  const tokensUrl = dexUrl[dex];

  const config = {
    timeout: 3000,
    uri: tokensUrl,
    method: 'GET',
    json: true,
  };

  const tokensResponse = await fetch(config);
  const { tokens } = tokensResponse;

  if (!tokens) {
    console.error(`error fetching data from ${this.name}: ${error}`);
    return false;
  } else {
    tokens.forEach(token => {
      tokensBySymbol[token.symbol] = token;
    })
    console.log('writing files -- ');
    fs.writeFile(`${__dirname}/json${dex}.json`, global.JSON.stringify(tokensResponse), console.error);
    fs.writeFile(`${__dirname}/tokens${dex}.json`, global.JSON.stringify(tokensBySymbol), console.error);
    return true;
  }
}

readFiles('COINGECKO');
