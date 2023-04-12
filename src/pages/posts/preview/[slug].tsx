import { GetStaticPaths, GetStaticProps } from "next"
import { prismic_client } from "../../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import styles from '../post.module.scss'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps{
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

interface ActiveSubscription {
    activeSubscription: Object;
}

export default function PostPreview({ post }: PostPreviewProps){
    const { data:session }: { data: any} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session]);

    return(
       <>
         <Head>
            <title>
                {post.title}
            </title>
        </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`}
                    dangerouslySetInnerHTML={{__html: post.content }}>
                        
                    </div>

                    <div className={styles.continueReading}>
                        Wanna continue reading? 
                        <Link href="/">
                         <span>Subscribe now 🤗</span>
                        </Link>
                    </div>
                </article>
            </main>
        
       </>
    )
}

//gera de forma estatica as paginas passadas no "paths" durante o build
//se nao passado nada no paths, as paginas sao geradas no primeiro acesso
//apenas para slugs
export const getStaticPaths:GetStaticPaths = async () => {
    return {
        paths: [{ params: { slug: '10-pacotes-essencias-para-javascript' } }],
        fallback: 'blocking' 
        //true: se alguem tentar acessar uma pagina que ainda nao foi gerada estaticamente, ira carregar a pagina pelo lado do browser (client-side)
        //false: se alguem acessar uma pagina que ainda nao foi gerada estaticamente, ira gerar um erro 404
        //block: se alguem tentar acessar uma pagina que ainda nao foi gerada estaticamente, irá tentar carregar a pagina pelo server side rendering (getStaticProps)
    }
}


export const getStaticProps:GetStaticProps = async ({ params }) => {
    const slug = params?.slug;

    const prismic = prismic_client;

    const response = await prismic.getByUID('publication', String(slug));

    //pre formatacao dos dados
    const post = { 
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: { post },
        revalidate: 60 * 30 //30 minutes
    }
    
}