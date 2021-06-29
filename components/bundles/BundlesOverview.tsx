import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/BundleOverview.module.css";
import { BundleRow } from "./BundleRow";
import { useBundleData } from "../../context/BundleData/BundleDataProvider";
import BundleModal from "./BundleModal";
import clsx from "clsx";

export default function BundlesOverview() {
  const router = useRouter();
  const { blocks, setFilters, filters, page, morePages, setPage } = useBundleData();
  const [bundle, setBundle] = useState(undefined);
  const [searchValue, setSearch] = useState(undefined);
  const [landingMutex, setLandingMutex] = useState(true);

  const setBundleAndOpen = useCallback(bundle => {
    // intermittent router.push insecure error
    if (bundle !== undefined) {
      router.push(`/?block=${bundle?.block_number}`, undefined, { shallow: true });
    }
    setBundle(bundle);
  }, [router]);

  useEffect(() => {
    if (router.query.block && blocks.length > 0 && landingMutex) {
      const blockNumber = router.query.block as unknown as string;
      if (blockNumber) {
        const local = blocks.find(b => b.block_number == blockNumber);
        if (local) {
          setBundleAndOpen(local);
          setLandingMutex(false);
        } else if(!filters.block_number) {
          setFilters({
            ...filters,
            block_number: blockNumber
          });
        }
      }
    } else if (filters.block_number) {
      const local = blocks.find(b => b.block_number == filters.block_number);
      if (local) {
        setFilters({
          ...filters,
          block_number: undefined
        });
      }
    }
  }, [router.query.block, blocks, filters, landingMutex, setBundleAndOpen, setFilters]);

  const submit = e => {
    e.preventDefault();
    const local = blocks.find(b => b.block_number == searchValue);
    if (local) {
      setBundleAndOpen(local);
    } else if(!filters.block_number) {
      setFilters({
        ...filters,
        block_number: searchValue
      });
    }
  };

  function sortBlocks(a, b): number {
    if (a.block_number < b.block_number) return 1;
    if (a.block_number > b.block_number) return -1;
    return 0;
  }

  return <div className="w-10/12 self-center text-center">
    <BundleModal open={ !!bundle }
      bundle={ bundle }
      close={ () => setBundle(undefined) } />
    <form className={styles.search}
      onSubmit={ submit }>
      <span>Search by block number</span>
      <input type="number"
        onChange={ e => setSearch(e.target.value) } />
      <button type="submit"> 🔍</button>
    </form>
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col"
                  className='table-heading'>Block number</th>
                <th scope="col"
                  className='table-heading'>Miner reward</th>
                <th scope="col"
                  className='table-heading'>Gas used</th>
                <th scope="col"
                  className='table-heading'>Effective gas price</th>
                <th scope="col"
                  className='table-heading'>Bundles</th>
                <th scope="col"
                  className='table-heading'>Inspect</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              { blocks?.sort(sortBlocks)
                .filter((block, index) => index < ((page - 1) * filters.limit) + filters.limit && index >= (page - 1) * filters.limit)
                .map((b, i) => <BundleRow index={ i }
                  key={ i }
                  bundle={ b }
                  setBundleAndOpen={ setBundleAndOpen } />) }
            </tbody>
          </table>
          {
            ((blocks.length > filters.limit) || page > 1)  && (
              <section className={clsx(styles.pagination, "traverse")}>
                <button
                  type="button"
                  className={clsx("mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm", {
                    "disabled": page === 1
                  })}
                  onClick={() => {
                    if (page !== 1) {
                      setPage(page - 1);
                    }
                  }}
                  disabled={page === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={
                    clsx("mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",{
                      "disabled": !morePages
                    })
                  }
                  onClick={() => {
                    if (morePages) {
                      setPage(page + 1);
                    }
                  }}
                  disabled={!morePages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </section>
            )
          }
        </div>
      </div>
    </div>
  </div>;
}
