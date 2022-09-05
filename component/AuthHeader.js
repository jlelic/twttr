import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthHeader() {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
                <div>
                    <Link href='/post'>Post to twttr</Link>
                </div>

            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}
