import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Transactions from '../components/Transactions';

export default function Home({ blocks }) {
  return (
    <div className='container flex flex-col'>
      <Head>
        <title> ⚡ Flashbots Explorer 🔍</title>
        <meta name="description" content="Explore Flashbots transactions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Transactions bundles={ blocks } />

      <footer className={styles.footer}>
        <a href="http://marto.lol" target="_blank" rel="noopener noreferrer"> Powered by Marto ⚡</a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://blocks.flashbots.net/v1/blocks');
  const { blocks } = await res.json();
  return {
    props: {
      blocks
    },
  }
}
