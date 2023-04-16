import { render } from '@testing-library/react';
import { ActiveLink } from '.';


jest.mock('next/router', () => {
    return{
        useRouter(){
            return {
                asPath: '/'
            }
        }
    }
});

describe('Active link component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <ActiveLink href='/' activeClassName='active'>
                <span>Home</span>
            </ActiveLink>
        )
    
        expect(getByText('Home')).toBeInTheDocument();
    });
    
    
    test('is receiving active class', () => {
        const { getByTestId } = render(
            <ActiveLink data-testid='active-link' href='/' activeClassName='active'>
                <span>Home</span>
            </ActiveLink>
        )
    
        const element = getByTestId('active-link');
    
        expect(element).toHaveClass('active');
    });
    
});

