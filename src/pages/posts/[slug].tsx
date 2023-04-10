import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { prismic_client } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from './post.module.scss'
import { authOptions } from "../api/auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";

interface PostProps{
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

interface UserSession extends Session{
    session: Session;
    activeSubscription: Object;
}

export default function Post({ post }: PostProps){
    return(
       <>
         <Head>
            <title>
                {post.title} | ReactPosts
            </title>
        </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div dangerouslySetInnerHTML={{__html: post.content }}>
                        
                    </div>
                </article>
            </main>
        
       </>
    )
}



export const getServerSideProps:GetServerSideProps = async ({ req, res, params }) => {
    // const session = await getServerSession({ req });
    const session:UserSession|null = await getServerSession(req, res, authOptions);
    const slug = params?.slug;

    if(!session?.activeSubscription){
        return{
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const prismic = prismic_client;

    const response = await prismic.getByUID('publication', String(slug));

    //pre formatacao dos dados
    const post = { 
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: { post }
    }
    
}