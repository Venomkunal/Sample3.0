'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import style from '@/app/styles/pages/pageCarousels.module.css';

import AddToCartButton from '@/app/component/buttons/AddToCartButton';
import { getProductRoute } from '@/app/utills/navigation';

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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const baseUrl2 = process.env.NEXT_PUBLIC_SITE_URL2 || 'http://localhost:3000';
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

export default function Carousels({ title }: { title: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [routeMap, setRouteMap] = useState<RouteMap>({});
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // ---- Drag / Touch State ----
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current =
      ('touches' in e ? e.touches[0].pageX : e.pageX) -
      (carouselRef.current?.offsetLeft || 0);
    scrollLeft.current = carouselRef.current?.scrollLeft || 0;
  };

  const duringDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    const x =
      ('touches' in e ? e.touches[0].pageX : e.pageX) -
      (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1; // multiplier = drag sensitivity
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  // ---- Extract category from URL ----
  const categoriesArray = pathname.split('/').filter(Boolean);
  const lastCategory =
    categoriesArray[categoriesArray.length - 1]?.toLowerCase() || '';
  const fullCategoryPath = categoriesArray.slice(1).join('/').toLowerCase();

  // ---- API Endpoint Helper ----
  const getApiEndpoint = (category: string, title: string) => {
    if (title.toLowerCase().includes('on sale')) {
      return `${baseUrl}/api/products/onsale?category=${encodeURIComponent(
        category
      )}`;
    } else if (title.toLowerCase().includes('new arrivals')) {
      return `${baseUrl}/api/products/newarrivals?category=${encodeURIComponent(
        category
      )}`;
    } else if (title.toLowerCase().includes('bannerproducts')) {
      return `${baseUrl}/api/products/banner?category=${encodeURIComponent(
        category
      )}`;
    } else {
      return `${baseUrl}/api/products?category=${encodeURIComponent(category)}`;
    }
  };

  // ---- Fetch Products ----
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = getApiEndpoint(lastCategory, title);
        const res = await fetch(endpoint, { cache: 'no-store' });
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
  }, [lastCategory, title]);

  // ---- Fetch SeeAll route map ----
  useEffect(() => {
    fetch(`${baseUrl2}/api/seeall`)
      .then((res) => res.json())
      .then((data: RouteMap) => setRouteMap(data))
      .catch((err) => console.error('Failed to fetch route map:', err));
  }, []);

  const seeAllHref = routeMap[title] || `/products/${fullCategoryPath}`;

  return (
    <div className={style.carouselsection}>
      <h2>{title}</h2>

      <div
        className={style.carouselwrapper}
        onMouseDown={startDrag}
        onMouseMove={duringDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={startDrag}
        onTouchMove={duringDrag}
        onTouchEnd={stopDrag}
      >
        <div className={style.fcarousel} ref={carouselRef}>
          {loading ? (
            <div className={style.spinner}>
              <Image
                src="/images/Spinner.svg"
                alt="Loading..."
                width={200}
                height={200}
              />
              <p>Loading .....</p>
            </div>
          ) : products.length === 0 ? (
            <div className={style.noproductfound}>
              <Image
                src="/images/not.gif"
                alt="No products"
                width={200}
                height={200}
                unoptimized
              />
              <p>No products found</p>
            </div>
          ) : (
            <>
              {products.map((product, index) => {
                const handleNavigate = () => {
                  const route = getProductRoute(
                    title,
                    product.id,
                    fullCategoryPath
                  );
                  router.push(route);
                };

                return (
                  <div
                    key={product.id}
                    className={style.productcard}
                    ref={index === 0 ? cardRef : null}
                  >
                    <div style={{ cursor: 'pointer' }} onClick={handleNavigate}>
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? `${uploadUrl}${product.images[0]}`
                            : '/images/placeholder.png'
                        }
                        alt={product.name}
                        width={200}
                        height={200}
                      />
                      <h3>{product.name}</h3>
                      <div className={style.priceSection}>
                        {product.discountPrice ? (
                          <span className={style.price}>
                            ₹{product.discountPrice}
                          </span>
                        ) : (
                          <span className={style.price}>
                            ₹{product.originalPrice}
                          </span>
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
                  </div>
                );
              })}

              <div className={style.seeall}>
                <Link href={seeAllHref}>
                  <button className="see-all-button">See All</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
