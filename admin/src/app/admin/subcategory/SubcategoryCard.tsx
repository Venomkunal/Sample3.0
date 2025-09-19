'use client';

import Image from 'next/image';
import styles from '@/app/styles/pages/subcategory.module.css';

type Props = {
  subcategory: {
    _id?: string;
    title: string;
    slug: string;
    image: string;
    href: string;
    parent: string | { _id: string; title: string; slug: string };
  };
  onEdit: () => void;
  onDelete: () => void;
};

export default function SubcategoryCard({ subcategory, onEdit, onDelete }: Props) {
  const parentLabel =
    typeof subcategory.parent === 'string'
      ? subcategory.parent // ID
      : subcategory.parent?.title || 'N/A'; // populated object

  return (
    <div className={styles.card}>
      <Image
        src={subcategory.image || '/images/placeholder.png'}
        alt={subcategory.title}
        width={200}
        height={150}
      />
      <h3>{subcategory.title}</h3>
      <p>Slug: {subcategory.slug}</p>
      <p>Parent: {parentLabel}</p>
      <div className={styles.actions}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
