import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react')



describe('SignInButton component', () => {
    it('renders correctly when user IS NOT authenticated', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

        render(
            <SignInButton />
        )
    
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('renders correctly when user IS authenticated', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValue({ data: { user: { name: 'John Doe', email: 'johndoe@test.com' }, expires: '2055' }, status: 'authenticated' });

        render(
            <SignInButton />
        )
    
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });


});
