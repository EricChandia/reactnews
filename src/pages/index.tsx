import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import laptop from '../../public/images/laptop2.png'
import cup from '../../public/images/cup.png'


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
      <title>Home | React News</title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👏 Hey, Welcome</span>
        <h1>To your daily <span>React</span> news world.</h1>
        <p>
          Get access to all publication <br />
          
        </p>
        <span>for {product.amount}</span>
        <SubscribeButton priceId={product.priceId}/>
      </section>



      <div className={styles.heroImage}>
          <Image className={styles.cup} src={cup} 
              alt='A cup of coffe'
              quality={100}
              priority={true}
              style={{
                width: '24%',
                height: 'auto',
                position: 'absolute',
                
              }}
              />

            <Image className={styles.laptop} src={laptop} 
            alt='A laptop'
            quality={100}
            priority={true}
            
            style={{
              width: '80%',
              height: 'auto',
              position: 'absolute',
            }}
            />
      </div>

      {/* <a href="https://www.freepik.com/free-vector/laptop-with-program-code-isometric-icon-software-development-programming-applications-dark-neon_4102879.htm#query=react%20developer&position=7&from_view=search&track=ais">Image by fullvector</a> on Freepik */}

    </main>

    </>
  )
}

export const getStaticProps:GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1MvMISCDILf8ZfjYVRXNjEvp', {
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