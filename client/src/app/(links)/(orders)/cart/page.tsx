'use client';

import { useCart } from '@/app/component/cartitem/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import '@/app/styles/pages/Cart.css';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/component/page/ToastContext';
import { useEffect, useRef } from 'react';

const viweUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL 

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const hasShownEmptyToastRef = useRef(false);

useEffect(() => {
  if (cart.length === 0 && !hasShownEmptyToastRef.current) {
    showToast('Your cart is empty.', 'info');
    hasShownEmptyToastRef.current = true;
  } else if (cart.length > 0) {
    hasShownEmptyToastRef.current = false;
  }
}, [cart, showToast]);
  const calculateTotals = () => {
    let subtotal = 0;
    let originalTotal = 0;

    cart.forEach((item) => {
      const price = parseFloat(item.discountPrice || item.originalPrice || '0');
      const original = parseFloat(item.originalPrice || '0');
      const quantity = item.quantity || 1;

      subtotal += price * quantity;
      originalTotal += original * quantity;
    });

    const discount = originalTotal - subtotal;
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping if subtotal > ₹1000
    const grandTotal = subtotal + tax + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };

    const handleCheckout = () => {
  if (cart.length === 0) {
    showToast('Your cart is empty.', 'info');
    return;
  }

  router.push('/checkout');
};

  const totals = calculateTotals();

  return (
    <div className="cart-container">
      <h1 className="cart-heading">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="cart-empty-image">
          <div className="cartemptyimage">
            <Image src="/images/ecard.png" alt="Empty Cart" width={300} height={300} />
          </div>
          <p className="cart-empty">Your cart is empty.</p>
          <Link href="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <Image 
                src={product.images && product.images.length > 0 ? `${viweUrl}${product.images[0] }`: '/images/placeholder.png'}
                alt={product.title} width={100} height={100} />
                <div className="flex-1">
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <p>Price: ₹{product.discountPrice || product.originalPrice}</p>
                  <div className="flex items-center gap-2">
                    <label className='qty'>Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={product.quantity}
                      onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                    />
                    <button onClick={() => removeFromCart(product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <div className="cart-summary">
              <p>Subtotal: ₹{totals.subtotal}</p>
              <p style={{ color: 'green' }}>You Saved: ₹{totals.discount}</p>
              <p>Tax (18% GST): ₹{totals.tax}</p>
              <p>Shipping: {totals.shipping === '0.00' ? 'Free' : `₹${totals.shipping}`}</p>
              <hr />
              <p className="cart-grand-total">Total Payable: ₹{totals.grandTotal}</p>
            </div>

            <div className="cart-buttons">
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
