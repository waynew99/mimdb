import styles from "../styles/Introduction.module.scss";
import Link from "next/link";

import { signIn } from "next-auth/client";


export default function Introduction() {

    return (
        <div className={styles.wrapper}>
            <h1>Welcome to Middlebury Movie Database</h1>

            <div className={styles.container}>
                <h2>Sign in</h2>
                <p>Sign in before accessing director submits, director edits, adminitrator submits.</p>
                <button onClick={signIn}>
                    Sign in
                </button>
            </div>

            <div className={styles.container}>
                <h2>Directors</h2>
                <p>
                    If this is your first time submitting a movie as a director please click on the New Director Submit button in order to add yourself as a director. You can add all of your personal info, and a brief biography. After you have added yourself, submit your film! You will know you have submitted yourself, if you can find yourself on the film submission page.
                </p>
                <div className={styles.buttonBar}>
                    <Link href="/directors/submit" passHref>
                        <p>New Director Submit</p>
                    </Link>
                    <Link href="/submit" passHref>
                        <p>New Film Submit</p>
                    </Link>
                </div>
            </div>

            <div className={styles.container}>
                <h2>Administrators</h2>
                <p>Administrators have the authority to approve and reject films that are displayed on the main page.</p>
                <div className={styles.buttonBar}>
                    <Link href="/admin" passHref>
                        <p>Admin</p>
                    </Link>
                </div>
            </div>
        </div>

    )
}