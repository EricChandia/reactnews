import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';

interface HomeProps{
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product } : HomeProps){
  return (
    <>
    <Head>
      <title>Home | ig.news</title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, Welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get acces to all publication <br />
          <span>for {product.amount}</span>
        </p>
        <SubscribeButton priceId={product.priceId}/>
      </section>

      {/* <Image src='/images/man_coding.png' alt='Man coding' width={600} height={400} quality={100}/> */}
      <Image src='/images/971.jpg' alt='Man coding' width={700} height={500} quality={100}/>
      {/* <a href="https://www.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_4102879.htm#query=react%20developer&position=7&from_view=search&track=ais">Image by fullvector</a> on Freepik */}

    </main>

    </>
  )
}

export const getStaticProps:GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1MoGczCDILf8ZfjYHrrz4caH', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount ? price.unit_amount / 100 : 0),
  }

  return{
    props: {
      product
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}