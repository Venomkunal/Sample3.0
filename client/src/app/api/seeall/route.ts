// File: app/api/seeall/route.ts

import { NextResponse } from 'next/server';

interface Category {
  title: string;
  href: string;
}

interface RouteMap {
  [key: string]: string;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  try {
    const response = await fetch(`${baseUrl}/api/categories`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch categories: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const categoriesData: Category[] = await response.json();

    const routeMap: RouteMap = categoriesData.reduce((acc: RouteMap, category: Category) => {
      acc[category.title] = category.href;
      return acc;
    }, {});

    return NextResponse.json(routeMap);
  } catch (error) {
    console.error('Error fetching categories in /api/seeall:', error);
    return NextResponse.json({ error: 'Failed to retrieve category data' }, { status: 500 });
  }
}
