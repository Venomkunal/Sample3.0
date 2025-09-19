'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/pages/ProductDetail.module.css';

export default function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <Image
          src={images[active]}
          alt={`Product ${active + 1}`}
          width={400}
          height={400}
          className={styles.mainImage}
          priority
        />
      </div>

      <div className={styles.thumbnailWrapper}>
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`Thumb ${idx + 1}`}
            width={80}
            height={80}
            className={`${styles.thumbnail} ${active === idx ? styles.activeThumb : ''}`}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>
    </div>
  );
}
