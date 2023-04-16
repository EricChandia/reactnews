import { fireEvent, render, screen } from '@testing-library/react';
import { SubscribeButton } from '.';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

// jest.mock('next-auth/react', () => {
//     return {
//         useSession: [null,'unauthenticated']
//     }
// });

// mock useRouter
// jest.mock('next/router', () => ({
//     useRouter: jest.fn()
// }));


jest.mock('next-auth/react');
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('SubscribeButton component', () => {
    it('it renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

        render(
            <SubscribeButton />
        )
    
        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = jest.mocked(signIn);
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

        render(
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);
    
        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = jest.mocked(useRouter);
        const useSessionMocked = jest.mocked(useSession);
        const pushMock = jest.fn();

        useSessionMocked.mockReturnValueOnce({ data: { user: { name: 'John Doe', email: 'johndoe@test.com' }, expires: '2055', activeSubscription: 'fake-active-subscription' }, status: 'authenticated' } as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any);

        render(
            <SubscribeButton/>
        )

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalledWith('/posts');
    });

});
