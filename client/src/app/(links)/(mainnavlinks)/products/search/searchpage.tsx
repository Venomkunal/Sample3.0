"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/pages/SearchPage.module.css";
import AddToCartButton from "@/app/component/buttons/AddToCartButton";

type Product = {
  id: string;
  _id?: string; // in case backend uses _id
  title: string;
  name: string;
  href: string;
  originalPrice: string;
  discountPrice: string;
  price: string;
  images: string[];
  category?: string | string[];
  description: string;
  quantity?: number;
  stock?: number;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${baseUrl}/products/search/all?q=${query}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setResults(data);

        // initialize quantities
        const qty: Record<string, number> = {};
        data.forEach((p: Product) => {
          const pid = p._id || p.id;
          qty[pid] = 1;
        });
        setQuantities(qty);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Search Results for <span>&quot;{query}&quot;</span>
      </h1>

      {loading && (
        <div className={styles.spinner}>
          <Image src="/images/Spinner.svg" alt="Loading" width={80} height={80} />
          <p>Loading ...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorBox}>
          <Image src="/images/not.gif" alt="Error" width={150} height={150} unoptimized />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className={styles.noResults}>
          <Image src="/images/not.gif" alt="No products" width={150} height={150} unoptimized />
          <p>No results found</p>
        </div>
      )}

      <div className={styles.grid}>
        {results.map((product) => {
          const pid = product._id || product.id;

          // ✅ take first category (array or comma separated)
          const category = Array.isArray(product.category)
            ? product.category[0]
            : product.category?.split(",")[0] || "general";

          return (
            <div key={pid} className={styles.card}>
              <Link
                href={`/products/${category}/id/${pid}`}
                className={styles.linkWrapper}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={
                      product.images && product.images.length > 0
                        ? `${uploadUrl}${product.images[0]}`
                        : "/images/placeholder.png"
                    }
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                </div>
                <h3 className={styles.name}>{product.title}</h3>
              </Link>

              <div className={styles.priceSection}>
                {product.discountPrice ? (
                  <>
                    <span className={styles.price}>₹{product.discountPrice}</span>
                    <span className={styles.oldPrice}>₹{product.originalPrice}</span>
                  </>
                ) : (
                  <span className={styles.price}>
                    ₹{product.originalPrice || product.price}
                  </span>
                )}
              </div>

              <div className={styles.quantityWrapper}>
                <label htmlFor={`qty-${pid}`}>Qty:</label>
                <input
                  type="number"
                  id={`qty-${pid}`}
                  min="1"
                  value={quantities[pid] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [pid]: Number(e.target.value),
                    }))
                  }
                  className={styles.quantityInput}
                />
              </div>

              <AddToCartButton
                product={{
                  ...product,
                  quantity: quantities[pid] || 1,
                }}
                className={styles.addtocart}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
