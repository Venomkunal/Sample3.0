'use client';
import { useEffect } from 'react';
import styles from '../styles/pages/Error.module.css';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Error page caught:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.title}>Something went wrong.</h1>
      <p className={styles.message}>An unexpected error occurred. Please try again later.</p>

      <div className={styles.buttons}>
        <button onClick={() => reset()} className={styles.button}>
          Try Again
        </button>
        <Link href="/" className={styles.linkButton}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
