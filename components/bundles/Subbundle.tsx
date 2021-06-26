import React from "react"
import { BundleTransaction } from "./BundleTransaction"
import { summarizeFp } from "./Helpers"

export const SubBundle = ({ subBundle, index } : { subBundle: any[]; index?: number }) => {
  return <>
    { subBundle.map(BundleTransaction) }
    {
      index === undefined
        ? <></>
        : <tr className="text-left bg-gray-100">
          <td className="pl-4"
            colSpan={ 3 }
          >
            #{ index + 1 }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm"></td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            { Math.round(subBundle.reduce((acc, tx) => acc + tx.gas_used, 0)) }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm"></td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            Ξ { summarizeFp(subBundle, "coinbase_transfer") }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            Ξ { summarizeFp(subBundle, "total_miner_reward") }
          </td>
        </tr>
    }
  </>
}