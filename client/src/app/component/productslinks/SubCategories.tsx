// client/src/components/SubCategories.tsx

import Image from 'next/image';
import Link from 'next/link';
import page from '@/app/styles/components/pagecarousel.module.css';
import Carousels from '@/app/component/carousels/pagecarousel';
import styles from '@/app/styles/pages/categories.module.css';

/* ------------ TYPES ------------ */
type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  href: string;
  pageheader: string;
  desc?: string;
};

type Subcategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  href: string;
  desc?: string;
};

type Props = {
  parent: string; // parent category slug
};

const viewUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

/* ------------ FETCH FUNCTIONS ------------ */
async function getCategory(slug: string): Promise<Category> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  console.log('Fetching category with slug:', slug);
  const res = await fetch(`${baseUrl}/api/categories/me/${slug}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.status}`);
  }
  return res.json();
}


async function getSubCategories(parent: string): Promise<Subcategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/subcategories?parent=${parent}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch subcategories');
  return res.json();
}

/* ------------ COMPONENT ------------ */
export default async function SubCategories({ parent }: Props) {
  const [category, subcategories] = await Promise.all([
    getCategory(parent),
    getSubCategories(parent),
  ]);


  return (
    <>
      <section className={styles.display}>
        <div className={styles.fcontainer}>
          {/* ✅ Parent Category Pageheader */}
          <h1>{category.pageheader || "Categories"}</h1>

          {subcategories.length === 0 ? (
            <div className={page.noproductfound}>
              <Image src='/images/not.gif' alt='' width={200} height={200} unoptimized />
              <p style={{ textAlign: 'center', fontSize: '1.2rem', padding: '2rem' }}>
                No subcategories found.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {subcategories.map((item) => (
                <div className={styles['category-card']} key={item._id}>
                  <Link href={item.slug}>
                    <Image
                      src={
                        item.image && item.image.length > 0
                          ? `${viewUrl}${item.image}`
                          : '/images/placeholder.png'
                      }
                      alt={item.title}
                      width={200}
                      height={150}
                    />
                  </Link>
                  <h3>{item.title}</h3>
                  <p>{item.description || item.desc}</p>
                  <Link href={item.slug}>Shop Now</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="On-Sale">
        <Carousels title="On sale Products" />
      </section>

      <section id="new-arrivals">
        <Carousels title="New Arrivals Products" />
      </section>

      <section id="end-banner">
        <div className={styles['end-banner']}></div>
      </section>
    </>
  );
}
