/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import { getReceipts } from '../lib/getReceipts';

export default function BundleModal({ 
  open,
  bundle,
  setOpen,
  goToNextBundle,
  goToPrevBundle,
}) {
  const cancelButtonRef = useRef();
  const router = useRouter();
  const close = () => {
    setOpen(false);
    if (bundle) {
      const { pathname, query } = router;
      delete query.block;
      router.push({ pathname, query });
    }
  };

  useEffect(() => {
    const { block } = router.query;
    if (block === undefined) {
      setOpen(false);
    }
  }, [router.query.block]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={ close }
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex-row justify-center">
                  {
                    bundle
                    ? <Bundle bundle={ bundle } />
                    : <Error blockNumber={ router.query.block } />
                  }
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">

                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={ close }
                  ref={cancelButtonRef}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={ goToNextBundle }
                >
                  Next
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={ goToPrevBundle }
                >
                  Prev
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const Bundle = ({ bundle }) => {
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

function SubBundle({ subBundle, index } : { subBundle: any[], index?: number }) {
  return <>
    { subBundle.map((transaction, index) => (
      <BundleTransaction transaction={transaction} index={index} />
    )) }
    {
      index === undefined
      ? <></>
      : <tr className="text-left bg-gray-100">
          <td className="pl-4" colSpan={ 3 }>
            #{ index + 1 }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm"></td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            { Math.round(subBundle.reduce((acc, tx) => acc + tx.gas_used, 0)) }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm"></td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            Ξ { summarizeFp(subBundle, 'coinbase_transfer') }
          </td>
          <td className="px-6 whitespace-nowrap text-center text-sm">
            Ξ { summarizeFp(subBundle, 'total_miner_reward') }
          </td>
        </tr>
    }
  </>;
}

const summarizeFp = (x, c): number => (x.reduce((acc, tx) => acc + tx[c] / 10 ** 18, 0)).toFixed(4);

const ExternalLinkIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>;

function BundleTransaction({ transaction, index }) {
  const [logs, setLogs] = useState([]);

  const router = useRouter();
  const onClick = (e, from) => {
    e.preventDefault();
    router.push(`/?from=${from}`, undefined, { shallow: true });
  };

  useEffect( () => {
    const getLogs = async () => setLogs(await getReceipts(transaction));
    getLogs();
  }, [transaction]);

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
    return acc;
  }, {});

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
    <tr key={ index } className={ index % 2 ? 'bg-gray-50' : '' }>
      <td className="block-number px-6 py-4 whitespace-nowrap text-center">
        <a className="flex text-sm justify-center hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${ transaction.transaction_hash }`}>
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
            Object.keys(coins).map(coin => <div className="flex flex-row items-center">
              <a key={ "a_" + index + now() } className="flex hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/address/${ coins[coin].address }`} style={{ margin: 3}}>
                {
                  coins[coin].logo
                    ? <img className="w-4 mr-1" key={ "i_" + index + now() } src={coins[coin].logo} />
                    : <></>
                }
                <b>{ coin }</b>
              </a>
              { coins[coin].value > 0 ? " " + coins[coin].value : "" }
              { coins[coin].ethValue > 0 ? " ($"+coins[coin].ethValue +")" : "" }
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
  </Fragment>;
}

const Error = ({ blockNumber }) => <div>
  <Dialog.Title as="h3" className="m-5 text-lg leading-6 font-medium text-gray-900">
    Oops
  </Dialog.Title>
  <div className="">Bundle not found in block #{blockNumber}, have this instead:  🍌</div>
</div>;

function Address({ address } : { address: string }) {
  const size = 6;
  const shorten = (address: string): string => address.slice(0, size) + '...' + address.slice(-size);
  return <a className="flex text-sm justify-center hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/address/${ address }`}>
    <div className="text-sm text-gray-900">{ shorten(address) } </div>
  </a>;
}

const now = () => {
  return randomMaxMin(Date.now(), Date.now()*10000);
};

const randomMaxMin = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
