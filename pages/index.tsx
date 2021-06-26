import Head from "next/head"
import React, { useEffect } from "react"
import { useRouter } from "next/router"
import * as ga from "../lib/ga"
import styles from "../styles/Home.module.css"
import Home from "./Home"
import { BundleDataProvider } from "../context/BundleData/BundleDataProvider"
import { TokenDataProvider } from "../context/TokenData/TokenDataProvider"

export default function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(ga.pageview)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }

    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <BundleDataProvider>
      <TokenDataProvider>
        <article className='App flex flex-col'>
          <a className="github-fork-ribbon"
            href="https://github.com/martriay/flashbots-explorer"
            data-ribbon="Contribute in GitHub"
            title="Contribute in GitHub">Contribute in GitHub</a>
          <h3 className={styles.header}>
            <span className={styles.emoji}> ⚡ </span>
            <span className={styles.gradient}>Flashbots Bundle Explorer </span>
            <span className={styles.emoji}>🤖</span>
          </h3>
          <a className="text-center text-red-700 p-1 bg-yellow-400 hover:underline"
            href="https://gitcoin.co/grants/2871/flashbots-bundle-explorer">Find this app useful? Fund it on Gitcoin!</a>
          <Head>
            <title> 🤖 Flashbots Bundle Explorer ⚡ </title>
            <meta name="description"
              content="Explore Flashbots bundles" />
            <link rel="icon"
              href="/favicon.ico" />
            <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css" />
          </Head>
          {/*   */}
          <Home />
          <footer className={styles.footer}>
            <span>⚠️ beware of <a href="https://marto.lol"
              target="_blank" 
              rel="noopener noreferrer">marto.lol</a></span>
          </footer>
        </article>
      </TokenDataProvider>
    </BundleDataProvider>
  )
}