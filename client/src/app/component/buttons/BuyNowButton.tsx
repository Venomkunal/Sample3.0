'use client';

import { useCart } from '@/app/component/cartitem/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/component/page/ToastContext';
// import style from '@/app/styles/components/Carousels.module.css';

type Props = {
  product: {
    id: string;
    title: string;
    originalPrice: string;
    discountPrice: string;
    price: string;
    images: string[];
    image?: string;
    href: string;
    description: string;
    quantity?: number;
    stock?: number;
  };
  className?: string;
};

export default function BuyNowButton({ product, className }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const quantity = product.quantity || 1;
  const stock = product.stock ?? Infinity;
  const outOfStock = stock <= 0;

  const handleClick = () => {
    if (outOfStock) {
      showToast('This product is currently out of stock.', 'error');
      return;
    }

    if (quantity > stock) {
      showToast(`Only ${stock} available in stock.`, 'error');
      return;
    }

    addToCart(product);
    showToast(`${product.title} added to cart!`, 'success');
    router.push('/checkout');
  };

  return (
    <button
      className={`${className || ''}`}
      onClick={handleClick}
      disabled={outOfStock}
      style={{ opacity: outOfStock ? 0.6 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
    >
      {outOfStock ? 'Notify me when available' : 'Buy Now'}
    </button>
  );
}


