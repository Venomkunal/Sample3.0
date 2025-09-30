'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  createdAt?: string;
  saleEnd?: string;
};

type RouteMap = Record<string, string>;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';
const baseUrl2 = process.env.NEXT_PUBLIC_SITE_URL2 || 'http://localhost:3000';
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

// ---------- Countdown Hook ----------
const useCountdown = (endTime?: string) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const diff = new Date(endTime).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};

// ---------- Product Card ----------
function ProductCard({
  product,
  categories,
  index,
  cardRef,
  router,
  uploadUrl,
  quantities,
  setQuantities,
}: {
  product: Product;
  categories: string;
  index: number;
  cardRef: React.RefObject<HTMLDivElement | null>;
  router: ReturnType<typeof useRouter>;
  uploadUrl?: string;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const isNew =
    product.createdAt &&
    new Date().getTime() - new Date(product.createdAt).getTime() <
      7 * 24 * 60 * 60 * 1000;

  const countdown = useCountdown(product.saleEnd);

  return (
    <div
      style={{ cursor: 'pointer' }}
      key={product.id}
      className={style.productcard}
      ref={index === 0 ? cardRef : null}
    >
      {/* 🔥 Sale Tag Top-Left */}
      {product.saleEnd && countdown !== 'Expired' && (
        <div className={`${style.tagWrapper} ${style.tagTopLeft}`}>
          <span className={style.saleTag}>On Sale: {countdown}</span>
        </div>
      )}

      {/* 🆕 New Tag Bottom-Right */}
      {isNew && (
        <div className={`${style.tagWrapper} ${style.tagBottomRight}`}>
          <span className={style.newTag}>New</span>
        </div>
      )}

      <Image
        onClick={() =>
          router.push(`${baseUrl2}/products/${categories}/id/${product.id}`)
        }
        src={
          product.images && product.images.length > 0
            ? `${uploadUrl}${product.images[0]}`
            : '/images/placeholder.png'
        }
        alt={product.name}
        width={200}
        height={200}
      />

      <h3
        onClick={() =>
          router.push(`${baseUrl2}/products/${categories}/id/${product.id}`)
        }
      >
        {product.title}
      </h3>

      <div
        className={style.priceSection}
        onClick={() =>
          router.push(`${baseUrl}/products/${categories}/id/${product.id}`)
        }
      >
        {product.discountPrice ? (
          <>
            <span className={style.price}>₹{product.discountPrice}</span>
            <span className={style.originalPrice}>₹{product.originalPrice}</span>
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
  );
}

// ---------- Main Component ----------
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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // ---------- Mouse Auto Scroll ----------
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;

    const { clientX, currentTarget } = e;
    const { left, right } = currentTarget.getBoundingClientRect();

    const edgeThreshold = 80; // px from edge to trigger scroll
    const scrollAmount = 220; // card width

    if (scrollTimeout.current) return; // throttle

    if (clientX > right - edgeThreshold) {
      // 👉 Move Right
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else if (clientX < left + edgeThreshold) {
      // 👈 Move Left
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 400);
  };

  // ---------- Keyboard Arrow Navigation ----------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!carouselRef.current) return;
      const scrollAmount = 220;

      if (e.key === 'ArrowRight') {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ---------- Determine API Endpoint ----------
  const getApiEndpoint = useCallback(() => {
    const categoryQuery = categories
      ? `?category=${encodeURIComponent(categories)}`
      : '';
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
      .then((data: RouteMap) => {
        setRouteMap(data);
      })
      .catch((err) => console.error('Failed to fetch route map:', err));
  }, []);

  const seeAllHref = routeMap[title] || `/products/${categories}`;

  // ---------- Render ----------
  return (
    <div
        className={style.carouselwrapper}
        onMouseMove={handleMouseMove} // ✅ auto scroll
      >
    <div className={style.carouselsection}>
      <h2>{title}</h2>
        <div className={style.fcarousel} ref={carouselRef}>
          {loading ? (
            <div className={style.spinner}>
              <Image
                src="/images/Spinner.svg"
                alt="Loading"
                width={200}
                height={200}
              />
              <p>Loading .....</p>
            </div>
          ) : error ? (
            <div className={style.noproductfound}>
              <Image
                src="/images/not.gif"
                alt="Error"
                width={200}
                height={200}
                unoptimized
              />
              <p className={style.message}>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={style.noproductfound}>
              <Image
                src="/images/not.gif"
                alt="No products found"
                width={200}
                height={200}
                unoptimized
              />
              <p className={style.message}>No products found</p>
            </div>
          ) : (
            <>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                  index={index}
                  cardRef={cardRef}
                  router={router}
                  uploadUrl={uploadUrl}
                  quantities={quantities}
                  setQuantities={setQuantities}
                />
              ))}

              <div className={style.seeall}>
                <Link href={seeAllHref} className="see-all-button">
                  <button>See All</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
