/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { stripe } from "../../services/stripe";
import { authOptions } from "./auth/[...nextauth]";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id: string
    }

}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST'){
        const session:Session|null = await getServerSession(req, res, authOptions);

        const user: User = await fauna.query(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session?.user?.email ?? '')
                )
            )
        );

        let customerId = user.data.stripe_customer_id;

        if(!customerId){
            const stripeCustomer = await stripe.customers.create({
                email: session?.user?.email || '',
                //metadata
            });
    
            await fauna.query(
                q.Update(
                    q.Ref(
                        q.Collection('users'), user.ref.id),
                        {
                            data: {
                                stripe_customer_id: stripeCustomer.id
                            }
                        }
                    )
                );

            customerId = stripeCustomer.id;
        }



        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{
                quantity: 1,
                price: 'price_1MvMISCDILf8ZfjYVRXNjEvp',
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL || '',
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({ sessionId: checkoutSession.id })
    }else{
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}