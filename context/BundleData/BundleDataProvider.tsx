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
  // TODO: type this 
  transactions: any[]
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
  const { query } = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([])
  const [page, setPage] = useState<number>(1)
  const [morePages, setMorePages] = useState<boolean>(false)
  const [filters, _setFilters] = useState<IBundleFilters>({
    limit: 10
  })

  // Update filter from query
  useEffect(() => {
    const { from } = query;
    if (from && filters.from != from) {
      _setFilters({
        ...filters,
        from: from
      })
    }
  }, [query.from]);

  useEffect(() => {
    // Change page back to first if filters are changed
    setPage(1)
  }, [filters, setPage])

  function getSubBundles(bundle) {
    return bundle.transactions.reduce((acc, curr) => {
      if (acc[curr.bundle_index]) {
        acc[curr.bundle_index].push(curr);
      } else {
        acc[curr.bundle_index] = [curr];
      }
      return acc;
    }, []);
  }
  
  function transformBundle(bundle) {
    bundle.transactions = getSubBundles(bundle);
    return bundle;
  }

  const getBlocks = useCallback(async () => {
    // TODO: Type Safety
    let params: Record<string, string> = {}
    Object.keys(filters).map(key => params[key] = filters[key])
    // This fetchs additional pages to a limit 
    // params["limit"] = `${Number(params["limit"]) * PAGES_AHEAD}`
    params["limit"] = `${Number(params["limit"]) + 1}`
    const url = `${process.env.FLASHBOTS_API_URL}/?${new URLSearchParams(params)}`
    debugger
    const res = await fetch(url)
    debugger
    const { blocks } = await res.json()
    debugger
    setBlocks(blocks.map(block => transformBundle(block)))
  }, [])

  useEffect(() => {
    if(blocks.length > filters.limit) {
      setMorePages(true)
    }else {
      setMorePages(false)
    }
  }, [blocks, setMorePages])

  // Automatically update when view is changed
  useEffect(() => {
    getBlocks()
  }, [filters, page])

  const setFilters = useCallback((filter: IBundleFilters) => {
    
  }, [])

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
