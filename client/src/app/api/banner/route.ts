// import { NextResponse } from 'next/server';
export async function GET() {
  const slides = [
    {
      id: 1,
      title: "30% off on all Women's Wear",
      name: 'Womens Collection',
      price: '₹1,299', // ✅ Add this
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit...',
      image: '/images/4.jpg',
      category: 'bannerproducts',
    },
    {
      id: 2,
      title: 'Summer Collection',
      name: 'Summer Vibes',
      price: '₹999',
      description: 'Discover our new summer arrivals with special discounts...',
      image: '/images/3.jpg',
      category: 'bannerproducts',
    },
    {
      id: 3,
      title: '',
      name: 'Winter Warmers',
      price: '₹1,799',
      description: 'Explore our warmest and trendiest collection...',
      image: '/images/1.png',
      category: 'bannerproducts',
    },
    {
      id: 4,
      title: 'Spring Collection',
      name: 'Spring Blossoms',
      price: '₹1,499',
      description: 'Fresh styles for a fresh season.',
      image: '/images/5.png',
      category: 'bannerproducts',
    },
  ];

  return new Response(JSON.stringify(slides), {
    headers: { 'Content-Type': 'application/json' },
  });
}
