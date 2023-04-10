import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user" },
      },
    })
  ],
  callbacks: {
    async session({ session }){

      let userActiveSubscription;

      try{
        userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email ?? '')
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
      }catch(error){
        console.log(error);
        return Promise.resolve ({
          ...session,
          activeSubscription: null
        })
      }

      return ({
        ...session,
        activeSubscription: userActiveSubscription
      })
    },

    async signIn({ user, account, profile }): Promise<boolean>{
      const email:string = user.email ?? '';

      //console.log(email);

      try{
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          )
        )

        return true;

        }catch{
          return false;
        }
    },
  }
  
};

export default NextAuth(authOptions)
