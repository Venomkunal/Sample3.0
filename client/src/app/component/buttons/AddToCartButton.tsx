
'use client';

import { useCart } from '@/app/component/cartitem/CartContext';
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

export default function AddToCartButton({ product , className }: Props) {
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();

  const cartItem = cart.find((item) => item.id === product.id);
  const inCartQty = cartItem?.quantity || 0;
  const maxStock = product.stock ?? Infinity;
  const isOutOfStock = inCartQty >= maxStock;

  const handleClick = () => {
    if (isOutOfStock) {
      showToast(`Only ${maxStock} available.`, 'error');
      return;
    }

    addToCart(product);
    showToast(`${product.title} added to cart!`, 'success');
  };

  return (
    <button
      className={` ${className || ''}`}
      onClick={handleClick}
      disabled={isOutOfStock}
    >
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}