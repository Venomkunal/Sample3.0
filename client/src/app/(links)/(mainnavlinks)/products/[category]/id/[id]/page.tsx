import Gallery from '@/app/component/productpagedetails/gallery';
import Rating from '@/app/component/productpagedetails/Rating';
import Wishlist from '@/app/component/productpagedetails/wishlist';
import AddToCartButton from '@/app/component/buttons/AddToCartButton';
import BuyNowButton from '@/app/component/buttons/BuyNowButton';
import styles from '@/app/styles/pages/ProductDetail.module.css';

type BackendProduct = {
  _id: string;
  title: string;
  name: string;
  category: string;
  discountPrice: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  images: string[];
  highlights: string[];
  delivery: string[];
  seller: string[];
  description: string;
  inStock: boolean;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL

  // let apiEndpoint = '/api/products';
  // if (category.toLowerCase() === 'onsale') {
  //   apiEndpoint = '/api/products/onsale';
  // } else if (category.toLowerCase() === 'newarrivals') {
  //   apiEndpoint = '/api/products/newarrivals';
  // } else if (category.toLowerCase() === 'bannerproducts') {
  //   apiEndpoint = '/api/banner';
  // }

  // const res = await fetch(`${baseUrl}${apiEndpoint}`, {
  //   cache: 'no-store',
  // });
    const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>Failed to load product.</div>;
  }

  const products: BackendProduct[] = await res.json();
  const product = products.find((p) => p._id === id);

  if (!product) {
    return <div>Product with ID `&#34;`{id}`&#34;` not found.</div>;
  }

  const original = Number(product.originalPrice);
  const discountP = Number(product.discountPrice);

  const discount =
    original > 0 && discountP >= 0
      ? Math.round(((original - discountP) / original) * 100)
      : 0;


  const quantity = 1;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Gallery images={product.images.map((img) => `${viewUrl}${img}`)} />

      </div>

      <div className={styles.right}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>{product.name}</h1>
          <Wishlist />
        </div>

        {product.rating > 0 && product.reviews > 0 ? (
          <Rating value={product.rating} count={product.reviews} />
        ) : (
          <p className={styles.noRating}>No ratings yet</p>
        )}

        <div className={styles.priceSection}>
          {product.discountPrice ? (
            <>
              <span className={styles.price}>₹{product.discountPrice}</span>
              <span className={styles.originalPrice}>₹{product.originalPrice}</span>
              <span className={styles.discount}>({discount}% OFF)</span>
            </>
          ) : (
            <span className={styles.price}>₹{product.originalPrice}</span>
          )}
        </div>
        {Array.isArray(product.highlights) && product.highlights.length > 0 && (
          <ul className={styles.highlights}>
            {product.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}

        {Array.isArray(product.delivery) && product.delivery.length > 0 && (
          <div className={styles.delivery}>
            Delivery: {product.delivery.join(', ')}
          </div>
        )}

        {Array.isArray(product.seller) && product.seller.length > 0 && (
          <div className={styles.seller}>Sold by: {product.seller.join(', ')}</div>
        )}


        {product.description && (
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        )}

        <div className={styles.buttons}>
          <AddToCartButton
            product={{
              id: product._id,
              title: product.title,
              originalPrice: String(product.originalPrice),
              discountPrice: String(product.discountPrice),
              price: String(product.discountPrice || product.originalPrice),
              images: product.images,
              image: product.images?.[0] || '',
              href: `/products/${product.category}/id/${product._id}`,
              description: product.description,
              quantity,
              stock: product.inStock ? 100 : 0,
            }}
            className={styles.addToCart}
          />
          <BuyNowButton
            product={{
              id: product._id,
              title: product.title,
              originalPrice: String(product.originalPrice),
              discountPrice: String(product.discountPrice),
              price: String(product.discountPrice || product.originalPrice),
              images: product.images,
              image: product.images?.[0] || '',
              href: `/products/${product.category}/id/${product._id}`,
              description: product.description,
              quantity,
              stock: product.inStock ? 100 : 0,
            }}
            className={styles.buyNow}
          />
        </div>
      </div>
    </div>
  );
}
