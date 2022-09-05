import styles from '../styles/Home.module.css'

export default function Tweet({ tweet: { user, content } }) {
    return (
        <div className={styles.card}>
            <h2>{user.name} posted:</h2>
            <p>{content}</p>
        </div>
    )
}
