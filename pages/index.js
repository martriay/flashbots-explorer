import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Bundles from '../components/Bundles';
import styles from '../styles/Home.module.css';
import * as ga from '../lib/ga';
import { getBlocks } from '../lib/api';

export default function Home({ initialBlocks }) {
  useEffect(ga.pageview);
  const [blocks, setBlocks] = useState(initialBlocks);

  const router = useRouter();

  useEffect(() => {
    const { from } = router.query;
    if (from) {
      const fetchFrom = async () => setBlocks(await getBlocks({ from }));
      fetchFrom();
    }
  }, [router.query.from]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };

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
        <span className={styles.tipjar}>❤️ tip jar: <span className={styles['tipjar-address']}>0x87122a7385fd61720d72290a6f2ed25b7eca7af7</span> 💸</span>
      </footer>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { from } = query;
  return {
    props: {
      initialBlocks: await getBlocks(from ? { from } : undefined)
    },
  }
}
