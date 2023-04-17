import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../src/pages/posts/[slug]";
import * as prismic from '@prismicio/client'
import { useRouter } from "next/router";

jest.mock('next-auth/react');
jest.mock('next-auth/next', () => jest.fn());
jest.mock('../../src/services/stripe');
jest.mock('@prismicio/client');
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));



const post = 
    {
        slug: 'my-new-post', title: 'My New Post', content: '<p>Post Content</p>', updatedAt: '13 de abril de 2023'
    }

const postData = 
    {
        data: {
            title: [ {
                type: 'heading', text: 'My New Post'
            } ],
            content: [ { 
                type: 'paragraph', text: 'Post content'
            } ]
        },
        last_publication_date: '04-13-2023'
    }
    

    // Criação do mock para o objeto prismic
    jest.mock('@prismicio/client', () => ({
        createClient: jest.fn(() => ({
            getByUID: jest.fn().mockResolvedValueOnce(
                postData
            )
        })),
    }));
  

describe('Post page', () => {

    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce( { data: { activeSubscription: true }  } as any);

        const useRouterMocked = jest.mocked(useRouter);
        const pushMock = jest.fn();
        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any);


        render(
            <Post post={post}/>
        )

        expect(screen.getByText('My New Post')).toBeInTheDocument();
        expect(screen.getByText('Post Content')).toBeInTheDocument();
        expect(pushMock).not.toHaveBeenCalled();
    });

    it('redirects user if no subscription is found', async () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: { activeSubscription: false }  } as any);

        const useRouterMocked = jest.mocked(useRouter);
        const pushMock = jest.fn();
        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any);


        render(
            <Post post={post}/>
        )

        expect(pushMock).toHaveBeenCalled();
    });

    it('loads initial data', async () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValueOnce( { data: { activeSubscription: true }  } as any);

        //chama o getServerSideProps somente da page Posts passando para ele os parametros que devemos testar
        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post content</p>',
                        updatedAt: '13 de abril de 2023'
                    }
                }
            })
        )
    });



});