import { useEffect } from 'react';
import Bundles from '../components/Bundles';
import * as ga from '../lib/ga';

export default function Home({}) {
  useEffect(ga.pageview);
  // TODO: Move query logic to
  return (
    <Bundles />
  )
}
