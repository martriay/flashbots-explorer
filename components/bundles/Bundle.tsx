import { Dialog } from "@headlessui/react";
import React from "react";
import { Block } from "../../context/BundleData/BundleDataProvider";
import { summarizeFp } from "./Helpers";
import { SubBundle } from "./Subbundle";

interface IBundle {
  bundle: Block
}

export const Bundle = ({ bundle }: IBundle) => {
  return <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
    <Dialog.Title as="h3" className="m-5 text-lg leading-6 font-medium text-gray-900">
      Bundles in #
      <a className="hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/block/${ bundle?.block_number }`}>
        { bundle?.block_number }
      </a>
    </Dialog.Title>

    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className='table-heading text-center px-3'>Hash</th>
                <th scope="col" className='table-heading text-center px-3'>From</th>
                <th scope="col" className='table-heading text-center px-3'>To</th>
                <th scope="col" className='table-heading text-center px-3'>Assets</th>
                <th scope="col" className='table-heading text-center px-3'>Gas used</th>
                <th scope="col" className='table-heading text-center px-3'>Gas price</th>
                <th scope="col" className='table-heading text-center px-3'>Coinbase transfer</th>
                <th scope="col" className='table-heading text-center px-3'>Miner reward</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                bundle.transactions.length > 1
                ? bundle.transactions.map((sb, i) => <SubBundle key={ i } index={ i } subBundle={ sb } />)
                : <SubBundle subBundle={ bundle.transactions[0] } />
              }

              <tr className="text-left bg-gray-200">
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold"></td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  { bundle.transactions.length } bundles
                </td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  { bundle.transactions.reduce((acc, b) => acc + b.length, 0) } transactions
                </td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold"></td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  { bundle.transactions.reduce((acc, txs) => acc + txs.reduce((ac2, tx) => ac2 + tx.gas_used, 0), 0)
                  }
                </td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  { Math.round(bundle.miner_reward / bundle.gas_used / (10 ** 9)) } gwei
                </td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  Ξ { bundle.transactions.reduce((acc, txs) => acc + Number(summarizeFp(txs, 'coinbase_transfer')), 0).toFixed(4) }
                </td>
                <td className="px-6 whitespace-nowrap text-center text-sm font-bold">
                  Ξ { bundle.transactions.reduce((acc, txs) => acc + Number(summarizeFp(txs, 'total_miner_reward')), 0).toFixed(4) }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>;
}
