import { Suspense } from "react";
import SearchPageClient from "./searchpage";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading search...</p>}>
      <SearchPageClient />
    </Suspense>
  );
}
