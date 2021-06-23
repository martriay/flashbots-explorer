import { useRouter } from "next/router"
import * as React from "react"
import { useCallback, useEffect } from "react"
import { useState } from "react"

type BundleDataContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

// TODO Update
export type Block = {
  hash: string
  block_number: string
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
  filters: IBundleFilters
  setFilters: (newFilter: IBundleFilters) => void
}

const BundleDataContext = React.createContext<IBundleDataContext | undefined>(undefined)

const BundleDataProvider = ({ children }: BundleDataContextProps) => {
  const { query } = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([])
  const [page, setPage] = useState<number>(1)
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

    const url = `${process.env.FLASHBOTS_API_URL}/?${new URLSearchParams(params)}`
    const res = await fetch(url)
    const { blocks } = await res.json()
    setBlocks(blocks.map(block => transformBundle(block)))
  }, [])

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
