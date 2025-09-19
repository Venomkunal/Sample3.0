'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/pages/categories.module.css';
import style from '@/app/styles/components/Carousels.module.css';
import page from '@/app/styles/components/pagecarousel.module.css';
import '@/app/styles/pages/categories.css';
import VideoPlayer from '../video/normalvideo';
import Link from 'next/link';
import AddToCartButton from '@/app/component/buttons/AddToCartButton';

type Product = {
  id: string;
 productId:string;
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

const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 

export default function Productcards({ categories }: ProductcardsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let res;

        if (categories.toLowerCase() === 'onsale') {
          res = await fetch(`${baseUrl}/api/products/onsale`, { cache: 'no-store' });
        } else if (categories.toLowerCase() === 'newarrivals') {
          res = await fetch(`${baseUrl}/api/products/newarrivals`, { cache: 'no-store' });
          console.log(res);
        }
        else if (categories.toLowerCase() === 'bannerproducts') {
          res = await fetch(`${baseUrl}/api/banner`, { cache: 'no-store' });
          console.log(res);
        } else {
          const query = `?category=${encodeURIComponent(categories)}`;
          res = await fetch(`${baseUrl}/api/products${query}`, { cache: 'no-store' });
          console.log(res);
        }

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: Product[] = await res.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories,baseUrl]);

  function prettifyCategory(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>
        {prettifyCategory(categories)}
        {prettifyCategory(categories).toLowerCase().includes('products') ? '' : ' Products'}
      </h2>

      {loading ? (
        <div className={page.spinner}>
          <Image src="/images/Spinner.svg" alt="Loading spinner" width={200} height={200} />
          <p>Loading .....</p>
        </div>
      ) : products.length === 0 ? (
        <div className="noproductfound" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <VideoPlayer />
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
            <Link href="/categories">
              <button className="btn-primary">Visit Categories</button>
            </Link>
            <Link href="/">
              <button className="btn-primary">Go Home</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div onClick={() => router.push(`/products/${categories}/id/${product.productId}`)} style={{ cursor: 'pointer' }}>
                <Image 
                src={product.images && product.images.length > 0 ? `${viewUrl}${product.images[0] }`: '/images/placeholder.png'}
                alt={product.name} width={200} height={200} className={styles.image} />
                <h3>{product.name}</h3>
                <div
                    className={styles.priceSection}
                    onClick={() =>
                      router.push(`${baseUrl}/products/${categories}/id/${product.productId}`)
                    }
                  >
                    {product.discountPrice ? (
                      <>
                        <span className={style.price}>₹{product.discountPrice}</span>
                        <span className={style.originalPrice}>₹{product.originalPrice}</span>
                        <span className={style.discount}>
                          (
                          {Math.round(
                            (1 - Number(product.discountPrice) / Number(product.originalPrice)) *
                              100
                          )}
                          % OFF)
                        </span>
                      </>
                    ) : (
                      <span className={style.price}>₹{product.originalPrice}</span>
                    )}

                    <div className={style.quantityWrapper}>
                    <label htmlFor={`qty-${product.id}`}>Qty:</label>
                    <input
                      type="number"
                      id={`qty-${product.id}`}
                      min="1"
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.id]: Number(e.target.value),
                        }))
                      }
                      className={style.quantityInput}
                    />
                  </div>
                    
                     <AddToCartButton
                    product={{
                      ...product,
                      quantity: quantities[product.id] || 1,
                    }}
                    className={style.addtocart}
                  />

                  </div>
              </div>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
