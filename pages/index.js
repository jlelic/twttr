import Head from 'next/head'
import Image from 'next/image'
import styles from '/styles/Home.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import Tweet from '/component/Tweet'
import Link from 'next/link'
import { PrismaClient } from "@prisma/client"
import { TextDecoder } from 'next/dist/compiled/@edge-runtime/primitives/encoding'


export default function Home({ tweet, relatedTweets }) {

    const defaultTweet = {
        user: {
            name: 'Jozef'
        },
        content: 'Hello world!'
    }

    console.log(relatedTweets)
    tweet = tweet || defaultTweet

    return (
        <>
            <h1 className={styles.title}>
                Welcome to Twttr!
            </h1>

            <Tweet tweet={tweet}/>
            <div className={styles.grid}>
                {relatedTweets.map(tweet => <Tweet key={tweet.id} tweet={tweet}/>)}
            </div>
        </>
    )
}

export async function getServerSideProps(context) {

    const prisma = new PrismaClient()

    const count = await prisma.tweet.count()


    const randomId = (Math.floor(Math.random() * count) + 1) | 0

    console.log('random: ' + randomId)
    const tweet = await prisma.tweet.findUnique({
        where: {
            id: randomId
        },
        include: {
            user: true
        }
    })

    const tweetWords = tweet.content.replace(/[.}{#!,?]/g, ' ').trim().toLocaleLowerCase().split(/\s/)
    const uniqueWords = [...new Set(tweetWords)]

    const words = await prisma.word.findMany({
        where: {
            word: {
                in: uniqueWords
            },
            tweetId: {
                not: tweet.id
            }
        }
    })

    const rTweetIds = [...new Set(words.map(word => word.tweetId))]

    const relatedTweets = await prisma.tweet.findMany({
        where: {
            id: {
                in: rTweetIds
            }
        },
        include: {
            user: true
        }
    })

    return {
        props: { tweet, relatedTweets }
    }
}
