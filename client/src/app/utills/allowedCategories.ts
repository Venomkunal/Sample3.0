

// client/src/utils/allowedCategories.ts
export async function getAllowedCategoryPaths(): Promise<string[][]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/paths/`, {
    cache: "no-store",
  });
  // console.log(res);
  if (!res.ok) {
    console.error("Failed to fetch allowed category paths:", res.statusText);
    return [];
  }

  // if (!res.ok) return [];

  const dbPaths: string[][] = await res.json();


  // Add manual static paths
  const staticPaths: string[][] = [
    ["kidclothes"],
    [ "menclothes"],
    [ "womenclothes"],
  [ "onsale"],
  [ "featuredproducts"],
  [ "newarrivals"], // 👈 no "products" needed if you follow same structure
  [ "allproducts"],
  ];

  const normalizedDbPaths = dbPaths.map(path => {
  // remove "categories" if it's the first segment
  return path[0] === "categories" ? path.slice(1) : path;
});

return [...normalizedDbPaths, ...staticPaths];

  // return [...dbPaths, ...staticPaths];
}
