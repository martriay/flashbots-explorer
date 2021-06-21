import { getAllLogs } from '../lib/ABILogs';

export async function getReceipts(transaction) {
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
    return await getAllLogs(logs);
  } catch(e) {
    console.log(e);
  }

  return [];
}
