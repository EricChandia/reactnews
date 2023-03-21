import Image from "next/image";
import { SignInButton } from "../SignInButton";
import styles from './styles.module.scss';

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/vercel.svg" alt="ig.news" width={50} height={50}/>
            <nav>
                <a>Home</a>
                <a>Posts</a>
            </nav>

            <SignInButton />
            </div>
        </header>
    )
}