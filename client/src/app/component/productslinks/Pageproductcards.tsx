'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/pages/categories.module.css';
import '@/app/styles/pages/categories.css';
import page from '@/app/styles/components/pagecarousel.module.css'
import AddToCartButton from '@/app/component/buttons/AddToCartButton'; // ✅ Import AddToCartButton component


type Product = {
  id: string;
  title: string;
  name: string;
  originalPrice: string;
  discountPrice: string;
  price: string;
  images: string[];
  image: string;
  href: string;
  category?: string;
  description: string;
  quantity?: number;
  stock?: number;
};

type ProductcardsProps = {
  categories: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 


export default function Productcards({ categories }: ProductcardsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ---------- Fetch Products ----------
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let res;

      if (categories.toLowerCase() === 'onsale') {
        // Fetch from onsale API if category is 'on-sale'
        res = await fetch(`${baseUrl}/api/products/onsale`, { cache: 'no-store' });
      } 
      else if (categories.toLowerCase() === 'newarrivals') {
        // Fetch from featured API if category is 'featured'
        res = await fetch(`${baseUrl}/api/products/newarrivals`, { cache: 'no-store' });
      }
      else {
        // Otherwise fetch from products API with category
        const query = `?category=${encodeURIComponent(categories)}`;
        res = await fetch(`${baseUrl}/api/products${query}`, { cache: 'no-store' });
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [categories]);

  // ---------- Prettify Category Name ----------
  function prettifyCategory(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

  // ---------- Render ----------
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>
  {prettifyCategory(categories)}{prettifyCategory(categories).toLowerCase().includes('products') ? '' : ' Products'}
</h2>

      {loading ? (
        <div className="spinner">
                <Image src='/images/Spinner.svg' alt='' width={200} height={200} />
                <p>Loading .....</p>
              </div>
      ) : products.length === 0 ? (
        <div className={page.noproductfound}>
                <Image src='/images/not.gif' alt='' width={200} height={200} unoptimized />
                <p className={styles.message}>No products found for category {categories}</p>
                </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              {/* ---- Navigate on Image Click ---- */}
              <div onClick={() => router.push(`/products/${categories}/id/${product.id}`)} style={{ cursor: 'pointer' }}>
                <Image
                  src={product.images && product.images.length > 0 ? `${viewUrl}${product.images[0] }`: '/images/placeholder.png'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className={styles.image}
                />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
              {/* ✅ Client Add to Cart button */}
                        <AddToCartButton
                          product={{
                            ...product,
                          }}
                          />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}