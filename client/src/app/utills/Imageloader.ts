export type LoaderParams = {
  src: string;
  width?: number;
  quality?: number;
};

/**
 * Example: CDN image loader
 */
export function cdnImageLoader({ src, width, quality }: LoaderParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || 'https://cdn.example.com';

  return `${baseUrl}${src}?w=${width || 800}&q=${quality || 75}`;
}

/**
 * Example: Local image loader (useful for fallback or dev env)
 */
export function localImageLoader({ src }: LoaderParams): string {
  return `/images${src}`;
}

/**
 * Example: Auto detect loader (CDN in production, local in dev)
 */
export function autoImageLoader({ src, width, quality }: LoaderParams): string {
  if (process.env.NODE_ENV === 'production') {
    return cdnImageLoader({ src, width, quality });
  }
  return localImageLoader({ src, width, quality });
}
