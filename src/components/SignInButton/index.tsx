import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';
import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton(){
    const { data: session, status } = useSession();

    // console.log(session);

    return status === 'authenticated' ? (
        <button type="button" className={styles.signInButton}>
            <span className={styles.fullBtn}>
                <FaGithub color='#04d361'/>
                {session.user?.name}
                <FiX color='#737380' className={styles.closeIcon} onClick={() => signOut()}/>
            </span>
            <span onClick={() => signOut()} className={styles.gitAbvUser}>{session?.user?.name?.slice(0, 1)}</span>
        </button>
    ) : (
        <button 
        type="button" 
        className={styles.signInButton}
        onClick={() => signIn('github')}>
            <FaGithub color='#eba417'/>
            <span className={styles.signInGit}>Sign in with Github</span>
        </button>
    )
}