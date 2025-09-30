'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../styles/pages/pcard.module.css';
import Pageheading from '../../../component/page/pageheading';
import Carousels from '../../../component/carousels/carousel';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------------- TYPES ---------------- */
type SubCategory = {
  _id?: string;
  title: string;
  slug: string;
  href: string;
  image?: string;
  description?: string;
};

type Category = {
  _id?: string;
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
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const router = useRouter();

  /* ----------- Fetch categories ----------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/categories`);
        if (!res.ok)
          throw new Error(`Failed to fetch categories: ${res.status}`);
        const data = await res.json();

        const categoriesArray: Category[] = Array.isArray(data)
          ? data
          : data.categories || [];
        setCategories(categoriesArray);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  /* ----------- Click category -> show subcategories ----------- */
  const handleClick = async (cat: Category) => {
    setActiveCategory(cat);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/subcategories?parent=${cat.slug}`);
      if (!res.ok)
        throw new Error(`Failed to fetch subcategories: ${res.status}`);
      const data = await res.json();
      setSubcategories(data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  /* ----------- Double click -> navigate ----------- */
  const handleDoubleClick = (href: string) => {
    router.push(href);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <>
      {/* Categories Grid */}
      <section className={styles.display}>
        <div className={styles.fcontainer}>
          <Pageheading />
          <div className={styles.grid}>
            {categories.map((item) => (
              <div
                key={item._id}
                className={`${styles['category-card']} ${
                  activeCategory?.slug === item.slug ? styles.active : ''
                }`}
                onClick={() => handleClick(item)}
                onDoubleClick={() => handleDoubleClick(item.href)}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={`${viewUrl}${item.image}`}
                    alt={item.title}
                    width={250}
                    height={180}
                    className={styles.categoryImage}
                  />
                </div>

                <div className={styles.content}>
                  <h3>{item.title}</h3>
                  <p>{item.description || item.desc}</p>
                  <Link className={styles.shopBtn} href={item.href}>
                    Shop Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <AnimatePresence>
        {activeCategory && subcategories.length > 0 && (
          <motion.section
            key={activeCategory.slug}
            className={styles.subSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.fcontainer}>
              <h2 className={styles.subTitle}>
                {activeCategory.title} Subcategories
              </h2>
              <div className={styles.subgrid}>
                {subcategories.map((sub) => (
                  <motion.div
                    className={styles['subcategory-card']}
                    key={sub._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onDoubleClick={() => handleDoubleClick(sub.href)}
                  >
                    <Link href={sub.href}>
                      <Image
                        src={`${viewUrl}${sub.image}`}
                        alt={sub.title}
                        width={180}
                        height={140}
                        className={styles.subImage}
                      />
                    </Link>
                    <div className={styles.subContent}>
                      <h4>{sub.title}</h4>
                      {sub.description && <p>{sub.description}</p>}
                      <Link className={styles.shopBtn} href={sub.href}>
                        Shop Now →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Product Carousels */}
      <section id="On-Sale">
        <Carousels title='🔥 On Sale Products'  categories='onsale' endpoint='/api/products/onsale'/>
      </section>

      <section id="new-arrivals">
        <Carousels title="✨ New Arrivals" categories={'newarrivals'} />
      </section>

      <section id="end-banner">
        <div className={styles['end-banner']}></div>
      </section>
    </>
  );
}
