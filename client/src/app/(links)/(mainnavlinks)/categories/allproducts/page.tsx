'use client';
import Pcard from '@/app/component/productslinks/Pcards';
import Productcards from '@/app/component/productslinks/Pageproductcards';

export default function AllProductsPage() {
  return (
    <main>
      {/* Show categories except 'allproducts' */}
      <Pcard />

      {/* Show all products */}
      <Productcards categories="allproducts" />
    </main>
  );
}


