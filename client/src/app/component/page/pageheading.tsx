'use client';

import { usePathname } from 'next/navigation';

const PageHeading = () => {
  const path = usePathname();

  // Extract the last part of the path
  const pageName = path === '/' ? 'Home' : path.split('/').filter(Boolean).pop();

  const titleMap: { [key: string]: string } = {
    categories: 'Shopping Categories',
    about: 'About Us',
    contact: 'Contact Us',
    products: 'Our Products',
    'newarrivals': 'New Arrivals',
    'womenclothes': 'Women’s Clothing',
    'menclothes': 'Men’s Clothing',
    'kidclothes': 'Kids’ Clothing',
    'allproducts': 'All Products',
    'featured': 'Featured Products',
    'womenproducts': 'Women Products',
    'menproducts': 'Men Products',
    'kidproducts': 'Kid Products'
  };

  return <h1>{titleMap[pageName || ''] || 'Categories'}</h1>;
};

export default PageHeading;
