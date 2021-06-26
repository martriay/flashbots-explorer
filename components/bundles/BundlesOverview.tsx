import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import styles from "./css/BundleOverview.module.css"
import { BundleRow } from "./BundleRow"
import { useBundleData } from "../../context/BundleData/BundleDataProvider"
import BundleModal from "./BundleModal"
import clsx from "clsx"

export default function BundlesOverview() {
  const router = useRouter()
  const { blocks, setFilters, filters, page, morePages, setPage } = useBundleData()
  const [bundle, setBundle] = useState(undefined)
  const [searchValue, setSearch] = useState(undefined)
  const [landingMutex, setLandingMutex] = useState(false)


  const setBundleAndOpen = useCallback(bundle => {
    // router.push insecure error
    // if (bundle !== undefined) {
    //   router.push(`/?block=${bundle?.block_number}`, undefined, { shallow: true })
    // }
    setBundle(bundle)
  }, [])

  useEffect(() => {
    if (router.query.block && blocks.length > 0 && !landingMutex) {
      const blockNumber = router.query.block as unknown as string
      if (blockNumber) {
        const local = blocks.find(b => b.block_number == blockNumber)
        if (local) {
          setBundleAndOpen(local)
          setLandingMutex(true)
        } else if(!filters.block_number) {
          setFilters({
            ...filters,
            block_number: blockNumber
          })
        }
      }
    } else if (filters.block_number) {
      const local = blocks.find(b => b.block_number == filters.block_number)
      if (local) {
        setFilters({
          ...filters,
          block_number: undefined
        })
      }
    }
  }, [router.query.block, blocks, filters, landingMutex, setBundleAndOpen, setFilters])


  const submit = e => {
    e.preventDefault()
    const local = blocks.find(b => b.block_number == searchValue)
    if (local) {
      setBundleAndOpen(local)
    } else if(!filters.block_number) {
      setFilters({
        ...filters,
        block_number: searchValue
      })
    }
  }

  function sortBlocks(a, b): number {
    if (a.block_number < b.block_number) return 1
    if (a.block_number > b.block_number) return -1
    return 0
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
              <section className={styles.pagination}>
                <button
                  onClick={() => {
                    if (page !== 1) {
                      setPage(page - 1)
                    }
                  }}
                  disabled={page === 1}
                  className={clsx({
                    "disabled": page === 1
                  })}
                >
                  Previous page
                </button>
                <button
                  onClick={() => {
                    if(morePages) {
                      setPage(page + 1)
                    }
                  }}
                  disabled={!morePages}
                  className={clsx({
                    "disabled": !morePages
                  })}
                >
                  Next page
                </button>
              </section>
            )
          }
        </div>
      </div>
    </div>
  </div>
}
