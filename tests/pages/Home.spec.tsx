import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../src/pages";
import { useSession } from "next-auth/react";
import {stripe} from "../../src/services/stripe";

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));
jest.mock('next-auth/react');
jest.mock('../../src/services/stripe');
// jest.mock('next/image', () => ({
//     __esModule: true,
//     default: (props: any) => {
//       // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
//       return <img {...props} />
//     },
//   }))

describe('home page', () => {

    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession);

        useSessionMocked.mockReturnValue({ data: null, status: 'unauthenticated' });


        const { debug } = render(
            <Home product={{ priceId: 'fake-price-id', amount: '$8.90' }}/>
        )

        expect(screen.getByText('for $8.90')).toBeInTheDocument();
    
    });

    it('loads initial data', async () => {
        const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

        retrieveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 890,
        } as any);

        const response = await getStaticProps({ });

        expect(response).toEqual(expect.objectContaining({
            props: {
                product: {
                    priceId: 'fake-price-id',
                    amount: '$8.90'
                }
            }
        }))
    });

})