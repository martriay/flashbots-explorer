import React from "react";
import { Block } from "../../context/BundleData/BundleDataProvider";
import { ExternalLinkIcon } from "../icons/externalLink.icon";
import { OpenBookIcon } from "../icons/openBook.icon";

interface IBundleRow {
  index: number
  bundle: Block
  setBundleAndOpen: (bundle: Block) => void
}

export const BundleRow = ({ index, bundle, setBundleAndOpen }: IBundleRow) => {
  const onClick = e => {
    e.preventDefault();
    setBundleAndOpen(bundle);
  };

  return <tr className={ index % 2 ? "bg-gray-50" : "" }>
    <td className="block-number px-6 py-4 whitespace-nowrap text-center">
      <a className="flex text-sm justify-center hover:underline"
        target="_blank"
        rel="noreferrer"
        href={`https://etherscan.io/block/${ bundle.block_number }`}>
        { ExternalLinkIcon }
        <span className="ml-3"> { bundle?.block_number } </span>
      </a>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <span className="text-sm">
      Ξ { (bundle?.miner_reward / (10 ** 18)).toFixed(4) }
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm text-gray-900">{ bundle?.gas_used} </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm text-gray-900">
        { Math.round(bundle?.miner_reward / bundle?.gas_used / (10 ** 9)) } gwei
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <div className="text-sm text-gray-900">
        { bundle.transactions.length }
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap flex justify-center">
      <a href="#"
        onClick={ onClick }> { OpenBookIcon }</a>
    </td>
  </tr>;
};
