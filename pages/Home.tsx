import React, { useEffect } from 'react';
import BundlesOverview from '../components/bundles/BundlesOverview';
import * as ga from '../lib/ga';

export default function Home({}) {
  useEffect(ga.pageview);
  // TODO: Move query logic to
  return (
    <BundlesOverview />
  )
}
