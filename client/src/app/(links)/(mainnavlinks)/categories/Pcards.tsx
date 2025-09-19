'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../styles/pages/categories.module.css';
import Pageheading from '../../../component/page/pageheading';
import Carousels from '../../../component/carousels/carousel';

export const metadata = {
  title: 'Shopping Categories - Indian Bazaar Guy',
  description:
    'Explore our wide range of shopping categories including new arrivals, featured products, and more.',
  keywords: ['shopping categories', 'new arrivals', 'featured products'],
  authors: [{ name: 'Indian Bazaar Guy' }],
  creator: 'Indian Bazaar Guy',
  openGraph: {
    title: 'Shopping Categories - Indian Bazaar Guy',
    description:
      'Explore our wide range of shopping categories including new arrivals, featured products, and more.',
    url: 'https://ibg.infinityfreeapp.com/categories',
    type: 'website',
    images: ['https://ibg.infinityfreeapp.com/images/2.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping Categories - Indian Bazaar Guy',
    description:
      'Explore our wide range of shopping categories including new arrivals, featured products, and more.',
    images: ['https://ibg.infinityfreeapp.com/images/2.jpg'],
  },
  metadataBase: new URL('https://ibg.infinityfreeapp.com'),
};

type Category = {
  title: string;
  description?: string;
  desc?: string;
  image: string;
  href: string;
  slug: string;
};

const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

export default function Pcard() {
  const [categories, setCategories] = useState<Category[]>([]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Shopping Categories',
    description:
      'Explore shopping categories including new arrivals, featured products, men’s, women’s, and more.',
    url: 'https://ibg.infinityfreeapp.com/categories',
    creator: {
      '@type': 'Organization',
      name: 'Indian Bazaar Guy',
    },
  };

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/categories`);

      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);

      const data = await res.json();

      // Ensure we have an array
      const categoriesArray: Category[] = Array.isArray(data) ? data : data.categories || [];

      // Filter out 'allproducts' safely
      const filtered = categoriesArray.filter(cat => {
        if (!cat.slug) return true; // keep if slug missing
        return cat.slug.trim().toLowerCase() !== '<script>alert(1)</script>';
      });

      // console.log('Fetched:', categoriesArray);
      // console.log('Filtered:', filtered);

      setCategories(filtered);
    } catch (err) {
      console.error('Error fetching categories:');
      // console.error('Error fetching categories:', err);
    }
  };

  fetchCategories();
}, []);


  if (!categories || categories.length === 0) return null;

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className={styles.display}>
        <div className={styles.fcontainer}>
          <Pageheading />
          <div className={styles.grid}>
            {categories.map((item, i) => (
              <div className={styles['category-card']} key={i}>
                <Link href={item.href}>
                  <Image src={`${viewUrl}${item.image}`} alt={item.title} width={200} height={150} />
                </Link>
                <h3>{item.title}</h3>
                <p>{item.description || item.desc}</p>
                <Link href={item.href}>Shop Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="On-Sale">
        <Carousels title="On sale Products" categories={''} />
      </section>

      <section id="new-arrivals">
        <Carousels title="New Arrivals Products" categories={''} />
      </section>

      <section id="end-banner">
        <div className={styles['end-banner']}></div>
      </section>
    </>
  );
}
