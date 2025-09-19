// app/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Product = {
  id: string;
  title: string;
  originalPrice: string;
  discountPrice: string;
  images: string[];      // full gallery
  image?: string;        // first image for cart display
  quantity?: number;
  stock?: number;        // ✅ available stock
  description: string;
  href: string;
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Add product to cart with stock & quantity checks
  const addToCart = (product: Product) => {
    const firstImage = product.images?.[0] || '/images/placeholder.png';
    const incomingQty = product.quantity || 1;
    const maxStock = product.stock ?? Infinity;

    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);

      if (existing) {
        const currentQty = existing.quantity || 1;
        const newQty = currentQty + incomingQty;

        if (newQty > maxStock) {
          alert(`Only ${maxStock} in stock. You already have ${currentQty} in your cart.`);
          return prev;
        }

        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: newQty }
            : p
        );
      }

      if (incomingQty > maxStock) {
        alert(`Only ${maxStock} in stock.`);
        return prev;
      }

      return [...prev, { ...product, image: firstImage, quantity: incomingQty }];
    });
  };

  // ❌ Remove item
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔁 Update quantity manually
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity } : p
      )
    );
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
};
