import { useRouter } from "next/router"
import * as React from "react"
import { useCallback, useEffect } from "react"
import { useState } from "react"

type BundleDataContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

// If we want to display that theres more pages, we'll need to check on ther requests
// const PAGES_AHEAD = 5

// TODO Update
export type Block = {
  hash: string
  block_number: string
  miner_reward?: number
  gas_used?: number
  coinbase_transfers: number
  gas_price: number
  miner: string
  // TODO: type this 
  transactions: any[]
}


export type Transaction = {
  block_number: number
  bundle_index: number
  coinbase_transfer: number
  eoa_address: string
  gas_price: number
  gas_used: number
  to_address: string
  total_miner_reward: number
  transaction_hash: string
  tx_index: number
}

export interface IBundleFilters {
  from?: string | string[]
  to?: string
  block_number?: string
  limit: number
}

interface IBundleDataContext {
  blocks: Block[]
  page: number
  setPage: (page: number) => void
  morePages: boolean
  filters: IBundleFilters
  setFilters: (newFilter: IBundleFilters) => void
}

const BundleDataContext = React.createContext<IBundleDataContext | undefined>(undefined)

const BundleDataProvider = ({ children }: BundleDataContextProps) => {
  const { query } = useRouter()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [page, setPage] = useState<number>(1)
  const [morePages, setMorePages] = useState<boolean>(false)
  const [filters, _setFilters] = useState<IBundleFilters>({
    limit: 10
  })
  const [pageMutex, setPageMutex] = useState(false)
  // Update filter from query
  useEffect(() => {
    const { from } = query
    if (from && filters.from != from) {
      _setFilters({
        ...filters,
        from: from
      })
    }
  }, [query, filters])

  useEffect(() => {
    // Change page back to first if filters are changed
    setPage(1)
  }, [filters, setPage])

  function getSubBundles(bundle) {
    return bundle.transactions.reduce((acc, curr) => {
      if (acc[curr.bundle_index]) {
        acc[curr.bundle_index].push(curr)
      } else {
        acc[curr.bundle_index] = [curr]
      }
      return acc
    }, [])
  }

  const transformBundle = useCallback(bundle => {
    bundle.transactions = getSubBundles(bundle)
    return bundle
  }, [])

  const getBlocks = useCallback(async () => {
    // TODO: Type Safety
    const params: Record<string, string> = {}
    Object.keys(filters).map(key => params[key] = filters[key])
    // This fetchs additional pages to a limit 
    // params["limit"] = `${Number(params["limit"]) * PAGES_AHEAD}`
    params["limit"] = `${(Number(params["limit"]) * page) + 1}`
    const url = `${process.env.FLASHBOTS_API_URL}/?${new URLSearchParams(params)}`
    const res = await fetch(url)
    const resJson = await res.json()
    if (resJson.blocks !== undefined) {
      const existingBlocknumbers = blocks.map(block => block.block_number)
      const newBlocks = resJson.blocks
        .map(block => transformBundle(block)).filter(newBlock => existingBlocknumbers.indexOf(newBlock.block_number) < 0)
      if (newBlocks.length > 0) {
        setBlocks([
          ...blocks,
          ...newBlocks
        ])
      }
    }
    setPageMutex(false)
  }, [filters, blocks, page, transformBundle])

  useEffect(() => {
    if(blocks.length > filters.limit) {
      setMorePages(true)
    }else {
      setMorePages(false)
    }
  }, [blocks, filters.limit, setMorePages])

  // Automatically update when view is changed
  useEffect(() => {
    if (!pageMutex) {
      if ((page * filters.limit) + 1 > blocks.length) {
        setPageMutex(true)
        getBlocks()
      } else if (page === 1) {
        setPageMutex(true)
        getBlocks()
      }
    }
  }, [filters, page, blocks, pageMutex, getBlocks])

  const setFilters = useCallback((filter: IBundleFilters) => {
    // This intermidiary function is for removing filters gracefully later on
    const newItem: IBundleFilters = {
      limit: 10
    }
    Object.keys(filter).map(key => {
      if (filter[key]) {
        newItem[key] = filter[key]
      }
    })

    _setFilters(newItem)
  }, [_setFilters])

  return (
    <BundleDataContext.Provider
      value={{
        blocks,
        page,
        setPage,
        morePages,
        filters,
        setFilters
      }}
    >
      {children}
    </BundleDataContext.Provider>
  )
}

const useBundleData = () => {
  const context = React.useContext(BundleDataContext)
  if (context === undefined) {
    throw new Error("useBundleData must be used within a BundleDataProvider")
  }
  return context
}

export { BundleDataProvider, useBundleData }
