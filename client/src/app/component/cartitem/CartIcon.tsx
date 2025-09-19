'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/component/cartitem/CartContext';
import { useEffect, useState } from 'react';
import '@/app/styles/pages/Cart.css'; // make sure this is imported

export default function CartIcon() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <Link href="/cart" style={{ position: 'relative', display: 'inline-block' }}>
      <Image
      className='cart-icon'
        src="/images/cart.png"
        alt="Cart"
        width={46}
        height={46}
        priority
      />
      {itemCount > 0 && (
        <span
          className={`cart-badge ${animate ? 'pop' : ''}`}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}


