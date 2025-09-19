'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/app/styles/pages/Checkout.module.css';
import { useCart } from '@/app/component/cartitem/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/component/page/ToastContext';
// const authUrl = process.env.NEXT_AUTH_CHECK_URL || "http://localhost:5002";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toastShownRef = useRef(false); // 🔐 toast state persists across renders

  // ✅ Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5002/users/me', {
          credentials: 'include',
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem('token')}`,
          // },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          if (!toastShownRef.current) {
            showToast('Please login to proceed to checkout.', 'error');
            toastShownRef.current = true;
          }
          router.push('/login');
        }
      } catch (err) {
        if (!toastShownRef.current) {
          let message = 'Error checking authentication: ';
          if (err instanceof Error && err.message.includes('Failed to fetch')) {
            message = 'Network error: Please check your internet connection.';
          }
          showToast(message, 'error');
          toastShownRef.current = true;
        }
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      // ✅ Reset toast on route change/unmount
      toastShownRef.current = false;
    };
  }, [router, showToast]);

  // ✅ Logout handler (optional usage example)
  // const handleLogout = async () => {
  //   await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
  //     method: 'POST',
  //     credentials: 'include',
  //   });
  //   toastShownRef.current = false; // reset toast
  //   router.push('/login');
  // };

  if (loading) return <div className={styles.checkoutContainer}>Loading...</div>;
  if (!isAuthenticated) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat((item.discountPrice || item.originalPrice || '0').replace(/[^0-9.]/g, ''));
    return sum + price * (item.quantity || 1);
  }, 0);

  const originalTotal = cart.reduce((sum, item) => {
    const price = parseFloat((item.originalPrice || '0').replace(/[^0-9.]/g, ''));
    return sum + price * (item.quantity || 1);
  }, 0);

  const discountSaved = originalTotal - subtotal;
  const tax = subtotal * 0.18;
  const shipping = 50;
  const grandTotal = subtotal + tax + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    showToast('Order placed successfully!', 'success');
    clearCart();
    router.push('/thank-you');
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.heading}>Checkout</h1>

      <div className={styles.checkoutContent}>
        <form className={styles.form} onSubmit={handlePlaceOrder}>
          <h2>Billing & Shipping Info</h2>

          <div className={styles.formGroup}>
            <label>Name</label>
            <input type="text" required />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className={styles.formGroup}>
            <label>Address</label>
            <input type="text" required />
          </div>
          <div className={styles.formGroup}>
            <label>City</label>
            <input type="text" required />
          </div>
          <div className={styles.formGroup}>
            <label>Postal Code</label>
            <input type="text" required />
          </div>
          <div className={styles.formGroup}>
            <label>Country</label>
            <input type="text" required />
          </div>

          <button type="submit" className={styles.checkoutButton}>
            Place Order
          </button>
        </form>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <p>
              Your cart is empty. <Link href="/cart">Go back to cart</Link>
            </p>
          ) : (
            <>
              <ul>
                {cart.map((item) => {
                  const original = parseFloat((item.originalPrice || '0').replace(/[^0-9.]/g, ''));
                  const discount = parseFloat((item.discountPrice || item.originalPrice || '0').replace(/[^0-9.]/g, ''));
                  const qty = item.quantity || 1;
                  const hasDiscount = item.discountPrice && discount < original;
                  const percentOff = hasDiscount ? Math.round(((original - discount) / original) * 100) : 0;

                  return (
                    <li key={item.id} className={styles.summaryItem}>
                      <div className={styles.itemDetails}>
                        <span>{item.title} (x{qty})</span>
                        <div className={styles.priceDetails}>
                          {hasDiscount ? (
                            <>
                              <span className={styles.originalPrice}>₹{(original * qty).toFixed(2)}</span>
                              <span className={styles.discountPrice}>₹{(discount * qty).toFixed(2)}</span>
                              <span className={styles.percentOff}>({percentOff}% off)</span>
                            </>
                          ) : (
                            <span className={styles.discountPrice}>₹{(original * qty).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <hr />
              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tax (18%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                {discountSaved > 0 && (
                  <div className={styles.summaryRow}>
                    <span style={{ color: 'green' }}>You saved:</span>
                    <span style={{ color: 'green' }}>₹{discountSaved.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className={styles.summaryTotal}>
                  <strong>Total:</strong>
                  <strong>₹{grandTotal.toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
