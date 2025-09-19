'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/categories.module.css';
import '@/app/styles/pages/categories.css';
import AddToCartButton from '@/app/component/buttons/AddToCartButton'; // ✅ Import AddToCartButton component

// ---------- Types ----------
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
  categories: string[] | undefined;
};

// const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 

// ---------- Client Component ----------
export default function Productcards({ categories }: ProductcardsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const { addToCart } = useCart();
  const router = useRouter();

  function prettifyCategory(slug: string): string {
  return slug
    .split('-')                              // ['new', 'arrivals']
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // ['New', 'Arrivals']
    .join(' ');                              // "New Arrivals"
}

  const categoryPath = categories?.join('/') || '';
  const lastCategory = categories?.length ? categories[categories.length - 1] : 'All';
  const prettyCategory = prettifyCategory(lastCategory);

  // ---------- Fetch Products ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const query = categoryPath ? `?category=${encodeURIComponent(categoryPath)}` : '';
        const res = await fetch(`/api/products${query}`, { cache: 'no-store' });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryPath]);

  // ---------- Render ----------
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{prettyCategory} Products</h2>

      {loading ? (
        <div className="spinner">
          <Image src="/images/Spinner.svg" alt="Loading" width={200} height={200} />
          <p>Loading .....</p>
        </div>
      ) : error ? (
        <div className="noproductfound">
          <Image src="/images/not.gif" alt="Error" width={200} height={200} unoptimized />
          <p className={styles.message}>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="noproductfound">
          <Image src="/images/not.gif" alt="No products found" width={200} height={200} unoptimized />
          <p className={styles.message}>No products found for category {lastCategory}</p>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div
                onClick={() =>
                  router.push(`/products/${categoryPath}/id/${product.id}`)
                }
                style={{ cursor: 'pointer' }}
              >
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
              <AddToCartButton
                product={{
                  ...product,
                  href: `/products/${categoryPath}/id/${product.id}`,
                }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
