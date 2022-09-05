import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client"

export default async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (!session) {
        // Not Signed in
        res.status(401)
        res.end()
        return
    }

    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    const content = req.body

    const resultTweet = await prisma.tweet.create({
        data: {
            userId: user.id,
            content
        }
    })

    const words = content.replace(/[.}{#!,?]/g, ' ').trim().toLocaleLowerCase().split(/\s/)
    const uniqueWords = [...new Set(words)]

    const wordsResult = await prisma.word.createMany({
        data: uniqueWords.map(word => ({ word, tweetId: resultTweet.id }))
    })

    //console.log("Session", JSON.stringify(session, null, 2))
    res.json(resultTweet)
    res.end()
}
