import { GetStaticProps } from "next";
import { prismic_client } from "../../services/prismic";
import Head from "next/head";
import styles from './styles.module.scss';
import { RichText } from "prismic-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Post = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

interface PostProps{
    posts: Post[]
}

export default function Posts({ posts } : PostProps){
    const { data:session }: { data: any} = useSession();
    const activeSubscription = session?.activeSubscription ? true : false;

    return(
        <>
            <Head>
                <title>Posts | React-Posts</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map((post:Post) => (
                        <Link href={activeSubscription ? `/posts/${post.slug}` : `/posts/preview/${post.slug}`} key={post.slug}>
                            <time>
                            {post.updatedAt}
                            </time>
                            <strong>{post.title}</strong>
                            <p>{post.excerpt}</p>
                        </Link>
                    )) }
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = prismic_client;

    const results = await prismic.getAllByType('publication', 
    { 
        fetchLinks : ['publication.title', 'publication.content'],
        pageSize: 100 
    } );

    const posts = results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    });

    // console.log(results);

    return {
        props: {
            posts
        }
    }
}