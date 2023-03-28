import Stripe from "stripe";

const api_key = process.env.STRIPE_API_KEY || '';

export const stripe = new Stripe(
    api_key,
    {
        apiVersion: '2022-11-15',
        appInfo: {
            name: 'Ignews',
            version: '0.1.0'
        }
    }
)