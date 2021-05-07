import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BundleModal from './BundleModal';
import styles from '../styles/Home.module.css';

export default function Bundles({ bundles }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [bundle, setBundle] = useState(undefined);

  const setBundleAndOpen = bundle => {
    router.push(`/?block=${bundle?.block_number}`, undefined, { shallow: true });
    setBundle(bundle);
    setOpenModal(true);
  };

  useEffect(() => {
    if (router.query.block) {
      const bundle = bundles.find(b => b.block_number == router.query.block);
      setBundleAndOpen(bundle);
    }
  }, [router.query.block])

  return <div className="w-10/12 self-center">
    <BundleModal open={ openModal } bundle={ bundle } setOpen={ setOpenModal } />
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className='table-heading'>Block number</th>
                <th scope="col" className='table-heading'>Miner reward</th>
                <th scope="col" className='table-heading'>Gas used</th>
                <th scope="col" className='table-heading'>Effective gas price</th>
                <th scope="col" className='table-heading'>Inspect bundle</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { bundles?.sort(sortBlocks).map((b, i) => <Bundle index={ i } bundle={ b } setBundleAndOpen={ setBundleAndOpen } />) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>;
};

function sortBlocks(a, b): number {
  if (a.block_number < b.block_number) return 1;
  if (a.block_number > b.block_number) return -1;
  return 0;
}

const ExternalLinkIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>;

const OpenBookIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
</svg>;

function Bundle({ index, bundle, setBundleAndOpen }) {
  const onClick = e => {
    e.preventDefault();
    setBundleAndOpen(bundle);
  };

  return <tr key={ index } className={ index % 2 ? 'bg-gray-50' : '' }>
    <td className="block-number px-6 py-4 whitespace-nowrap text-center">
      <a className="flex text-sm justify-center hover:underline" target="_blank" rel="noreferrer" href={`https://etherscan.io/block/${ bundle.block_number }`}>
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
    <td className="px-6 py-4 whitespace-nowrap flex justify-center">
      <a className={styles['book-icon']} href="#" onClick={ onClick }> { OpenBookIcon }</a>
    </td>
  </tr>;
}
