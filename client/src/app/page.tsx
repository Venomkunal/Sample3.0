import { Metadata } from 'next'
import Banner from '@/app/component/carousels/Banner';
import Carousels from '@/app/component/carousels/carousel';
import '@/app/styles/globle.css';

export const metadata:Metadata = {
  title:"Homepage - Indian Bazaar Guy",
}
// import Image from 'next/image';
export default function home() {
  return (
   <section id='main'>
    <section id ='banner'>
      <Banner/>
    </section>
    <section id='new-arrivals' >
      <Carousels title='New Arrivals' categories='newarrivals'endpoint='/api/products/newarrivals' />
    </section>
    <section id='featured-products'>
      <Carousels title='Featured Products' categories='featuredproducts' />
    </section>
    <section id='Onsale'>
      <Carousels title='On Sale'  categories='onsale' endpoint='/api/products/onsale'/>
    </section>
    <section id ='banner2.0'>
      <Banner/>
    </section>
    <section id='Men-products'>
      <Carousels title='Men Products' categories='menproducts' />
    </section>
    <section id='Women-products'>
      <Carousels title='Women Products' categories='womenproducts' />
    </section>
    <section id='kids-products'>
      <Carousels title='Kids Products' categories='kidsproducts' /> 
      </section>
    <section id='end-banner'>
      <div className='end-banner'>
        </div>
      </section>
   </section>
   
  );
}