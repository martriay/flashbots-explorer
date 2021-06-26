import React, { useEffect } from "react"
import BundlesOverview from "../components/bundles/BundlesOverview"
import * as ga from "../lib/ga"

export default function Home() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(ga.pageview)
  // TODO: Move query logic to
  return (
    <BundlesOverview />
  )
}
