'use client';

import { useAuthGuard } from '@/app/utills/AuthGuard';
import VideoPlayer from '@/app/component/video/videoplayer';
import Link from 'next/link';

export default function ThankYouPage() {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <VideoPlayer src="/videos/thankyou.mp4" />
      <h1>🎉 Thank You!</h1>
      <p>Your order has been placed successfully.</p>
      <Link
        href="/"
        style={{
          marginTop: '20px',
          display: 'inline-block',
          textDecoration: 'underline',
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

