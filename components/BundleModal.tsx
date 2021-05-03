/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function Example({ open, bundle, setOpen }) {
  const cancelButtonRef = useRef();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-min">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start justify-center">
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="m-5 text-lg leading-6 font-medium text-gray-900">
                      Bundle in #{ bundle?.block_number }
                    </Dialog.Title>

                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-200">
                              <tr>
                                <th scope="col" className='table-heading text-center'>Hash</th>
                                <th scope="col" className='table-heading text-center'>From</th>
                                <th scope="col" className='table-heading text-center'>To</th>
                                <th scope="col" className='table-heading text-center'>Gas used</th>
                                <th scope="col" className='table-heading text-center'>Gas price</th>
                                <th scope="col" className='table-heading text-center'>Coinbase transfer</th>
                                <th scope="col" className='table-heading text-center'>Total miner reward</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              { bundle?.transactions.map(BundleTransaction) }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const ExternalLinkIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>;

function BundleTransaction(transaction, index: number) {
  // block_number: 12358944
  // coinbase_transfer: "9785908415014455"
  // eoa_address: "0x07A962Ea36DdddA0c6e594F8A29b89aC06EC8FB7"
  // gas_price: "0"
  // gas_used: 89458
  // to_address: "0xa57Bd00134B2850B2a1c55860c9e9ea100fDd6CF"
  // total_miner_reward: "9785908415014455"
  // transaction_hash: "0xedbaa982717813b69e215fe08525ae85c3686a095a1b908714ef8755f58e754d"
  // tx_index: 0
  return <tr key={ index } className={ index % 2 ? 'bg-gray-50' : '' }>
    <td className="block-number px-6 py-4 whitespace-nowrap text-center">
      <a className="flex text-sm justify-center hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${ transaction.transaction_hash }`}>
        { ExternalLinkIcon }
        <span className="ml-3"> { transaction?.transaction_hash.slice(0, 10) }... </span>
      </a>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <Address address={ transaction?.eoa_address } />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <Address address={ transaction?.to_address } />
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
  </tr>;
}

function Address({ address } : { address: string}) {
  const size = 6;
  const shorten = (address: string): string => address.slice(0, size) + '...' + address.slice(-size);
  return <a className="flex text-sm justify-center hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/address/${ address }`}>
    <div className="text-sm text-gray-900">{ shorten(address) } </div>
  </a>;
}