// app/sitemap.ts
import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dynamic Pages
  const blogPosts = await getBlogPostsFromDatabaseOrAPI();
  const postPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const categories = await getCategoriesFromDatabaseOrAPI();
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt ?? now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}

// --- Simulated Dynamic Fetching ---

type Post = { slug: string; updatedAt: Date };
type Category = { slug: string; updatedAt?: Date };

async function getBlogPostsFromDatabaseOrAPI(): Promise<Post[]> {
  return [
    { slug: 'how-to-nextjs-sitemap', updatedAt: new Date('2024-05-01T10:00:00Z') },
    { slug: 'understanding-react-hooks', updatedAt: new Date('2024-04-15T14:30:00Z') },
    { slug: 'deploying-to-vercel', updatedAt: new Date('2024-06-01T09:00:00Z') },
  ];
}

async function getCategoriesFromDatabaseOrAPI(): Promise<Category[]> {
  return [
    { slug: 'web-development', updatedAt: new Date('2023-01-01T00:00:00Z') },
    { slug: 'frontend', updatedAt: new Date('2023-01-01T00:00:00Z') },
  ];
}
