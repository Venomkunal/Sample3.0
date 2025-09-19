// File: lib/data/categories.ts (Optional, if /api/categories fetches from DB)

// Define the interface for a single category object
export interface Category {
  href: string;
  title: string;
  description: string;
  image: string;
  type: string;
  slug: string;
}

// If your categories are hardcoded, keep this. If they come from a DB, this file might not exist.
export const categoriesData: Category[] = [
  {
    href: '/products/newarrivals',
    title: 'New Arrivals',
    description: 'Fresh styles updated for the new season. Hot off the runway — shop our newest pieces.',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'new-arrivals',
  },
  {
    href: '/products/featuredproducts',
    title: 'Featured Products',
    description: 'Top-rated picks chosen just for you. Our bestsellers and editor’s top selections.',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'featured',
  },
  {
    href: '/categories/men-products',
    title: "Men Products",
    description: 'Shirts, jeans, suits & more',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'men-products',
  },
  {
    href: '/categories/women-products',
    title: "Women Products",
    description: 'Dresses, tops, skirts & more',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'women-products',
  },
  {
    href: '/categories/kids-clothes',
    title: "Kids Products",
    description: 'Fun & comfortable for all ages',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'kidsclothes',
  },
  {
    href: '/categories/activewear',
    title: 'Activewear',
    description: 'Workout clothes for every lifestyle',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'activewear',
  },
  {
    href: '/categories/outerwear',
    title: 'Outerwear',
    description: 'Jackets, coats & seasonal styles',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'outerwear',
  },
  {
    href: '/categories/accessories',
    title: 'Accessories',
    description: 'Hats, belts, scarves & more',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'accessories',
  },
  {
    href: '/products/onsale',
    title: 'On Sale',
    description: 'Hats, belts, scarves & more',
    image: '/images/2.jpg',
    type: 'category',
    slug: 'onsale',
  },
];
