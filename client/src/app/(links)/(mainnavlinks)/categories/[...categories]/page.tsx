// client/src/app/(links)/(mainnavlinks)/(categories)/[...categories]/page.tsx
import Pcardsub from '@/app/component/productslinks/Pcards';
import Carousels from '@/app/component/carousels/pagecarousel';
import SubCategories from '@/app/component/productslinks/SubCategories';
import Productcard from '@/app/component/productslinks/Pageproductcards';
import Productcards from '@/app/component/productslinks/Productcards2.0';
import { getAllowedCategoryPaths} from '@/app/utills/allowedCategories';
import VideoPlayer from '@/app/component/video/normalvideo';
import Link from 'next/link';
// import NotFound from '@/app/not-found';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ categories: string[] }>;
}) {
  const { categories } = await params;

  if (!categories || categories.length === 0) {
    return <div>No categories provided</div>;
  }

  // ✅ Check if path is in the whitelist
   const allowedPaths = await getAllowedCategoryPaths();

  // ✅ check if current path matches any allowed path
  const isValidPath = allowedPaths.some(
    (path) =>
      path.length === categories.length &&
      path.every((seg, i) => seg === categories[i] || seg === "[id]")
  );

  if (!isValidPath) {
    return (
      <>
      <div
          className="noproductfound"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <VideoPlayer />
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '12px',
              justifyContent: 'center',
            }}
          >
            <Link href="/categories">
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Visit Categories
              </button>
            </Link>

            <Link href="/">
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
              <p>s</p>
            </Link>
          </div>
        </div>
      {/* <NotFound /> */}
        </>
    )
  }

  // Now safe to handle
  const lastCategory = categories[categories.length - 1];

  if (categories.length === 1 && categories[0] === 'categories') {
    return (
      <>
    <Pcardsub />
    <section id="On-Sale">
        <Carousels title="On sale Products"  />
      </section>

      <section id="new-arrivals">
        <Carousels title="New Arrivals Products" />
      </section>

      <section id="end-banner">
        <div className='end-banner'></div>
      </section>
      </>
  );
  }

  if (['onsale', 'featuredproducts', 'newarrivals'].includes(lastCategory)) {
    return <Productcards categories={lastCategory} />;
  }

  return (
    <>
      <SubCategories parent={lastCategory} />
      <Productcard categories={lastCategory} />
    </>
  );
}
