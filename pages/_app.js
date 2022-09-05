import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import AuthHeader from '../component/AuthHeader'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

function MyApp(
    {
        Component,
        pageProps: { session, ...pageProps },
    }
) {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>Twttr</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.container}>
                <AuthHeader/>
                <main className={styles.main}>
                    <Component {...pageProps} />
                </main>
            </div>
        </SessionProvider>
    )
}

export default MyApp
