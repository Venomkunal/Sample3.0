'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import '@/app/styles/globle.css';
import style from '@/app/styles/components/Carousels.module.css';
import AddToCartButton from '@/app/component/buttons/AddToCartButton';

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

type RouteMap = Record<string, string>;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';
const baseUrl2 = process.env.NEXT_PUBLIC_SITE_URL2 || 'http://localhost:3000';
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 

// ---------- Component ----------
export default function Carousels({
  title,
  categories,
  endpoint,
}: {
  title: string;
  categories: string;
  endpoint?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [routeMap, setRouteMap] = useState<RouteMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hovered, setHovered] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  

  // ---------- Determine API Endpoint ----------
  const getApiEndpoint = useCallback(() => {
    const categoryQuery = categories ? `?category=${encodeURIComponent(categories)}` : '';
    return `${baseUrl}${endpoint || '/api/products'}${categoryQuery}`;
  }, [categories, endpoint]);

  // ---------- Fetch Products ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const apiUrl = getApiEndpoint();
        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Product[] = await res.json();
        setProducts(data.slice(0, 20));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getApiEndpoint]);

  // ---------- Fetch See All routes ----------
  useEffect(() => {
    fetch(`${baseUrl2}/api/seeall`)
      .then((res) => res.json())
      .then((data: RouteMap) => setRouteMap(data))
      .catch((err) => console.error('Failed to fetch route map:', err));
  }, []);

  // ---------- Auto Scroll ----------
  useEffect(() => {
    const scrollCarousel = (dir: number) => {
      const cardWidth = cardRef.current?.offsetWidth || 200;
      carouselRef.current?.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    };

    const interval = setInterval(() => {
      const { scrollLeft = 0, scrollWidth = 0, clientWidth = 0 } = carouselRef.current || {};
      if (carouselRef.current) {
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          scrollCarousel(1);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ---------- Helpers ----------
  const scrollCarousel = (dir: number) => {
    const cardWidth = cardRef.current?.offsetWidth || 200;
    carouselRef.current?.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  const seeAllHref = routeMap[title] || `/products/${categories}`;

  // ---------- Render ----------
  return (
    <div className={style.carouselsection}>
      <h2>{title}</h2>

      <div
        className={style.carouselwrapper}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!loading && products.length > 0 && hovered && (
          <button className={style.fprev} onClick={() => scrollCarousel(-1)}>
            &#10094;
          </button>
        )}

        <div className={style.fcarousel} ref={carouselRef}>
          {loading ? (
            <div className={style.spinner}>
              <Image src="/images/Spinner.svg" alt="Loading" width={200} height={200} />
              <p>Loading .....</p>
            </div>
          ) : error ? (
            <div className={style.noproductfound}>
              <Image src="/images/not.gif" alt="Error" width={200} height={200} unoptimized />
              <p className={style.message}>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={style.noproductfound}>
              <Image src="/images/not.gif" alt="No products found" width={200} height={200} unoptimized />
              <p className={style.message}>No products found</p>
            </div>
          ) : (
            <>
              {products.map((product, index) => (
                <div
                  style={{ cursor: 'pointer' }}
                  key={product.id}
                  className={style.productcard}
                  ref={index === 0 ? cardRef : null}
                >
                  <Image
                    onClick={() =>
                      router.push(`${baseUrl2}/products/${categories}/id/${product.id}`)
                    }
                    src={product.images && product.images.length > 0 ? `${uploadUrl}${product.images[0] }`: '/images/placeholder.png'}

                    alt={product.name}
                    width={200}
                    height={200}
                  />
                  <h3 onClick={() =>
                    router.push(`${baseUrl2}/products/${categories}/id/${product.id}`)
                  }>{product.title}</h3>
                  {/* <p onClick={() =>
                    router.push(`${baseUrl}/products/${categories}/id/${product.id}`)
                  }>₹{product.price}</p> */}

                  <div
                    className={style.priceSection}
                    onClick={() =>
                      router.push(`${baseUrl}/products/${categories}/id/${product.id}`)
                    }
                  >
                    {product.discountPrice ? (
                      <>
                        <span className={style.price}>₹{product.discountPrice}</span>
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
                      <span className={style.price}>₹{product.originalPrice}</span>
                    )}
                  </div>

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
              ))}

              <div className={style.seeall}>
                <Link href={seeAllHref} className="see-all-button">
                  <button>See All</button>
                </Link>
              </div>
            </>
          )}
        </div>

        {!loading && products.length > 0 && hovered && (
          <button className={style.fnext} onClick={() => scrollCarousel(1)}>
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
}
