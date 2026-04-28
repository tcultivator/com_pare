import { Suspense } from "react";
import ProductListClient from "../components/ProductListClient";
import ProductListSkeleton from "../components/ProductListSkeleton";
import Link from "next/link";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    categories?: string;
    prices?: string;
    sort?: string;
    view?: string;
  }>;
};

/**
 * Formats slug → label
 */
function formatCategoryLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* ---------------- METADATA ---------------- */
export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;

  const label = formatCategoryLabel(category);

  return {
    title: `${label} | Products`,
    description: `Browse ${label} near you`,
  };
}

/* ---------------- PAGE ---------------- */
export default async function ProductListPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const sp = await searchParams;

  const categoryLabel = formatCategoryLabel(category);

  console.log("PAGE SEARCH PARAMS:", sp);

  // ✅ parse categories from URL
  const urlCategories =
    sp.categories?.split(",").filter(Boolean) ?? [];

  // ✅ include current category unless "all"
  const categories =
    category === "all"
      ? urlCategories
      : Array.from(new Set([categoryLabel, ...urlCategories]));

  const prices = sp.prices?.split(",").filter(Boolean) ?? [];
  const sort = sp.sort ?? "price_asc";
  const view = sp.view ?? "grid";

  console.log("Parsed categories:", categories);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">

            <Link href="/" className="hover:text-gray-800 transition-colors">
              Home
            </Link>

            <span>/</span>

            <Link
              href="/productList/all"
              className="hover:text-gray-800 transition-colors"
            >
              Products
            </Link>

            <span>/</span>

            <span className="text-gray-800 font-medium">
              {categoryLabel}
            </span>

          </nav>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListClient
            categories={categories}
            prices={prices}
            sort={sort}
            view={view}
          />
        </Suspense>
      </main>

    </div>
  );
}