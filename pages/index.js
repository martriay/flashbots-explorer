import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Bundles from '../components/Bundles';
import styles from '../styles/Home.module.css';
import * as ga from '../lib/ga';
import { transformBundle } from '../lib/getSubBundles';

export default function Home({ blocks }) {
  useEffect(ga.pageview);

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, [router.events]);

  return (
    <div className='App flex flex-col'>
      <Head>
        <title> 🤖 Flashbots Bundle Explorer ⚡ </title>
        <meta name="description" content="Explore Flashbots bundles" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css" />
      </Head>
      <a className="github-fork-ribbon" href="https://github.com/martriay/flashbots-explorer" data-ribbon="Contribute in GitHub" title="Contribute in GitHub">Contribute in GitHub</a>

      <h3 className={styles.header}>
        <span className={styles.emoji}> ⚡ </span>
        <span className={styles.gradient}>Flashbots Bundle Explorer </span>
        <span className={styles.emoji}>🤖</span>
      </h3>
      <Bundles bundles={ blocks } />

      <footer className={styles.footer}>
        <span>brewed with ⚡  by <a href="https://marto.lol" target="_blank" rel="noopener noreferrer">marto.lol</a></span>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('https://blocks.flashbots.net/v1/blocks');
  const { blocks } = await res.json();
  return {
    props: {
      blocks: blocks.map(b => transformBundle(b))
    },
  }
}
