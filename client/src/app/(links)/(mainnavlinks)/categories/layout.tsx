// import { Metadata } from 'next';
import '@/app/styles/pages/categories.css';

export const metadata = {
  title:"Categories",
  description: "Explore our wide range of shopping categories including new arrivals, featured products",
  keywords: "shopping categories, new arrivals, featured products",
  authors: [{ name: 'Indian Bazaar Guy', url: 'https://ibg.infinityfreeapp.com/' }],
  creator: 'Indian Bazaar Guy',
  }
  export default function CategoriesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        {children}
      </>
    );
  }