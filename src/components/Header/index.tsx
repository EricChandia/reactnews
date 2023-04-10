import Image from "next/image";
import { SignInButton } from "../SignInButton";
import styles from './styles.module.scss';
import Link from "next/link";
import { useRouter } from "next/router";
import { ActiveLink } from "../ActiveLink";

export function Header(){
    const { asPath } = useRouter();

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/vercel.svg" alt="ig.news" width={50} height={50}/>
            <nav>
                <ActiveLink href='/' activeClassName={styles.active}>
                    <div>Home</div>
                </ActiveLink>
                {/* <Link href='/posts' prefetch> <- desta forma irá carregar o posts antes de recusar abri-lo*/}
                <ActiveLink href='/posts' activeClassName={styles.active}>
                    <div>Posts</div>
                </ActiveLink>
            </nav>

            <SignInButton />
            </div>
        </header>
    )
}