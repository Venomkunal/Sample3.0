// components/Wishlist.tsx
'use client';
import { useState } from 'react';

export default function Wishlist() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked(!liked)}
      style={{
        border: 'none',
        background: 'transparent',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: liked ? 'red' : '#888',
      }}
      title="Add to Wishlist"
    >
      ♥
    </button>
  );
}
