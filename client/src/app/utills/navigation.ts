export function getProductRoute(
  title: string,
  productId: string,
  fullCategoryPath: string
): string {
  const normalized = title.toLowerCase();

  if (normalized.includes('on sale')) {
    return `/products/onsale/id/${productId}`;
  } else if (normalized.includes('new arrivals')) {
    return `/products/newarrivals/id/${productId}`;
  } else {
    return `/products/${fullCategoryPath}/id/${productId}`;
  }
}
