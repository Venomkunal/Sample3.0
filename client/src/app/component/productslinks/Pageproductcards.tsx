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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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
    <div className={page.wrapper}>
      <h2 className={page.heading}>
  {prettifyCategory(categories)}{prettifyCategory(categories).toLowerCase().includes('products') ? '' : ' Products'}
</h2>

      {loading ? (
        <div className={page.spinner}>
                <Image src='/images/Spinner.svg' alt='' width={200} height={200} />
                <p>Loading .....</p>
              </div>
      ) : products.length === 0 ? (
        <div className={page.noproductfound}>
                <Image src='/images/not.gif' alt='' width={200} height={200} unoptimized />
                <p className={styles.message}>No products found for category {categories}</p>
                </div>
      ) : (
        <div className={page.productGrid}>
          {products.map((product) => (
            <div key={product.id} className={page.card}>
              {/* ---- Navigate on Image Click ---- */}
              <div onClick={() => router.push(`/products/${categories}/id/${product.id}`)} style={{ cursor: 'pointer' }}>
                <Image
                  src={product.images && product.images.length > 0 ? `${viewUrl}${product.images[0] }`: '/images/placeholder.png'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className={page.image}
                />
                <h3>{product.name}</h3>
                <div
                    className={page.priceSection}
                    onClick={() =>
                      router.push(`${baseUrl}/products/${categories}/id/${product.id}`)
                    }
                  >
                    {product.discountPrice ? (
                      <>
                        <span className={page.price}>₹{product.discountPrice}</span>
                        {/* <span className={style.originalPrice}>₹{product.originalPrice}</span>
                        <span className={style.discount}>
                          (
                          {Math.round(
                            (1 - Number(product.discountPrice) / Number(product.originalPrice)) *
                              100
                          )}
                          % OFF)
                        </span> */}
                      </>
                    ) : (
                      <span className={page.price}>₹{product.originalPrice}</span>
                    )}
                  </div>
                <div className={page.quantityWrapper}>
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
                      className={page.quantityInput}
                    />
                  </div>

              </div>
              {/* ✅ Client Add to Cart button */}
                        <AddToCartButton
                                            product={{
                                              ...product,
                                              quantity: quantities[product.id] || 1,
                                            }}
                                            className={page.addtocart}
                                          />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}