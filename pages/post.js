import styles from '/styles/Home.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import Tweet from '/component/Tweet'
import { useRef, useState } from 'react'
import { MAX_LENGTH, POST_API_ROUTE } from '../lib/constants'

export default function Post() {

    const session = useSession()
    const router = useRouter()
    const textRef = useRef()

    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    if(!session || session.status === 'unauthenticated') {
        router.replace('/')
    }

    const isTextValid = () => {
        const text = textRef.current.value
        if(text.length > MAX_LENGTH) {
            setError(`Text cannot be longer than ${MAX_LENGTH}`)
            return false
        } else if(text.length === 0) {
            setError('TYPE SOMETHING!!')
            return false
        }

        setError(null)
        return true
    }

    const onPost = async () => {
        if(!isTextValid()) {
            return
        }

        const text = textRef.current.value
        const response = await fetch(POST_API_ROUTE, {method: 'POST', body: text})
        router.push('/')
    }

    return (
        <>
            <h1 className={styles.title}>
                Post to Twttr!
            </h1>

            <div>
                <div>
                    {error}
                </div>
                <textarea
                    ref={textRef}
                    rows={6}
                    cols={60}
                    onChange={isTextValid}
                />
                <div>
                    <button onClick={onPost} disabled={isLoading || error}>
                        Twttr it!
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
            </div>
        </>
    )
}
