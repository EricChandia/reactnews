import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import Posts, { getStaticProps } from "../../src/pages/posts";
import * as prismic from '@prismicio/client'

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));
jest.mock('next-auth/react');
jest.mock('../../src/services/stripe');
jest.mock('@prismicio/client');

const posts = [
    {
        slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '13 de abril de 2023'
    }
]


const results = [ 
    {
        uid: 'my-new-post',
        data: {
            title: [ {
                type: 'heading', text: 'My New Post'
            } ],
            content: [ { 
                type: 'paragraph', text: 'Post excerpt'
            } ]
        },
        last_publication_date: '04-13-2023'
    }
];

    // Criação do mock para o objeto prismic
    jest.mock('@prismicio/client', () => ({
        // Mock do método createClient
        createClient: jest.fn(() => ({
        // Mock do método getAllByType
        getAllByType: jest.fn().mockResolvedValueOnce(
                results
            ),
        })),
    }));
  

describe('Posts page', () => {

    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValue({ data: null, status: 'unauthenticated' });

        const { debug } = render(
            <Posts posts={posts}/>
        )

        expect(screen.getByText('My New Post')).toBeInTheDocument();
    
    });

    it('loads initial data', async () => {
        const useSessionMocked = jest.mocked(useSession);
        useSessionMocked.mockReturnValue({ data: null, status: 'unauthenticated' });
    
        const response = await getStaticProps({ });

        expect(response).toEqual(expect.objectContaining({
            props: {
                posts
            }
        }))
    });

});