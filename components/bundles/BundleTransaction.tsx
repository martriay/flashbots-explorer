import { useRouter } from "next/router"
import React, { Fragment, useEffect, useState } from "react"
import { useTokenData } from "../../context/TokenData/TokenDataProvider"
import { timeNow } from "../../helpers/general"
import { Address } from "../Address"
import { ExternalLinkIcon } from "../icons/externalLink.icon"

export const BundleTransaction = (transaction, index: number) => {
  const [logs, setLogs] = useState([])
  const { getReceipts } = useTokenData()
  const router = useRouter()
  const onClick = (e, from) => {
    e.preventDefault()
    router.push(`/?from=${from}`, undefined, { shallow: true })
  }

  useEffect(() => {
    const getLogs = async () => setLogs(await getReceipts(transaction))
    getLogs()
  }, [transaction, getReceipts])

  const coins = logs.reduce((acc, curr) => {
    if (curr.coin.name && (curr.coin.value || acc[curr.coin.name] === undefined)) {
      acc[curr.coin.name] = {
        event: curr.coin.event,
        address: curr.coin.address,
        logo: curr.coin.logo,
        value: curr.coin.value,
        ethValue: curr.coin.ethValue
      }
    }
    return acc
  }, {})

  // block_number: 12358944
  // coinbase_transfer: "9785908415014455"
  // eoa_address: "0x07A962Ea36DdddA0c6e594F8A29b89aC06EC8FB7"
  // gas_price: "0"
  // gas_used: 89458
  // to_address: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF"
  // total_miner_reward: "9785908415014455"
  // transaction_hash: "0xedbaa982717813b69e215fe08525ae85c3686a095a1b908714ef8755f58e754d"
  // tx_index: 0
  return <Fragment key={"f_" + index}>
    <tr key={ index }
      className={ index % 2 ? "bg-gray-50" : "" }>
      <td className="block-number px-6 py-4 whitespace-nowrap text-center">
        <a className="flex text-sm justify-center hover:underline"
          target="_blank"
          rel="noreferrer"
          href={`https://etherscan.io/tx/${ transaction.transaction_hash }`}>
          { ExternalLinkIcon }
          <span className="ml-3"> { transaction?.transaction_hash.slice(0, 10) }... </span>
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center">
          <a href={`/?from=${transaction?.eoa_address}`}
            onClick={ e => onClick(e, transaction?.eoa_address) }
            title="Find more bundles involving this address"
            className="mr-1">🔎</a>
          <Address address={ transaction?.eoa_address } />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Address address={ transaction?.to_address } />
      </td>
      <td className="flex flex-col px-6 py-4 whitespace-nowrap text-xs justify-center">
        {
          Object.keys(coins).map((coin, index) => <div key={`link-${index}`}
            className="flex flex-row items-center">
            <a key={ "a_" + index + timeNow() }
              className="flex hover:underline"
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${ coins[coin].address }`}
              style={{ margin: 3 }}>
              {
                coins[coin].logo
                  ? <img className="w-4 mr-1"
                    key={ "i_" + index + timeNow() }
                    src={coins[coin].logo} />
                  : <></>
              }
              <b>{ coin }</b>
            </a>
            { coins[coin].value > 0 ? " " + coins[coin].value : "" }
            { coins[coin].ethValue > 0 ? " ($" + coins[coin].ethValue + ")" : "" }
            { coins[coin].value ? "" : ` (${coins[coin].event})` }
          </div>)
        }
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-gray-900">
          { Math.round(transaction?.gas_used) }
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-gray-900">
          { Math.round(transaction?.gas_price / (10 ** 9)) } gwei
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-gray-900">
        Ξ { (transaction?.coinbase_transfer / (10 ** 18)).toFixed(4) }
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-gray-900">
        Ξ { (transaction?.total_miner_reward / (10 ** 18)).toFixed(4) }
        </div>
      </td>
    </tr>
  </Fragment>
}

