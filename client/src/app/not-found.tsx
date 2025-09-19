'use client';

import Link from 'next/link';
import styles from '@/app/styles/pages/NotFound.module.css'; // External CSS file
import VideoPlayer from '@/app/component/video/covervideo';

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <VideoPlayer src="/videos/404.mp4" />
      <div className={styles.textContent}>
        <h1>Oops! The page you&#39;re looking for doesn&#39;t exist.</h1>
        <Link href="/" className={styles.backHome}>
          Go back to Homepage
        </Link>
      </div>
    </main>
  );
}

