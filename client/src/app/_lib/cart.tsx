'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type CartItem = {
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleCartAction = (
    action: 'increase' | 'decrease' | 'remove',
    index: number
  ) => {
    const updatedCart = [...cart];
    if (action === 'increase') {
      updatedCart[index].quantity += 1;
    } else if (action === 'decrease') {
      updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity - 1);
    } else if (action === 'remove') {
      updatedCart.splice(index, 1);
    }
    updateCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-items">
      {cart.map((item, idx) => (
        <div key={idx} className="cart-item">
          <Image src={item.image} alt={item.name} width={80} height={80} />
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>{item.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => handleCartAction('decrease', idx)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleCartAction('increase', idx)}>+</button>
            </div>
            <button onClick={() => handleCartAction('remove', idx)}>Remove</button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-total">
          <h3>Total: {total.toFixed(2)}</h3>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

