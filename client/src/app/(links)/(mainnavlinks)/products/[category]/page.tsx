import Productcards from "@/app/component/productslinks/Productcards2.0";

export default async function SubCategoriesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return (
    <div>
      <Productcards categories={(await params).category} />
    </div>
  );
}
