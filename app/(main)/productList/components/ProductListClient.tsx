"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import Toolbar from "./Toolbar";
import { Product } from "../data/mockProducts";

type ProductListClientProps = {
  categories: string[];
  prices: string[];
  sort: string;
  view: string;
};

export default function ProductListClient({
  categories,
  prices,
  sort,
  view,
}: ProductListClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH PRODUCTS FROM API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const params = new URLSearchParams();

      if (categories.length > 0) {
        params.set("category", categories.join(","));
      }

      if (prices.length > 0) {
        const [min, max] = prices[0].split("-");
        params.set("minPrice", min);
        params.set("maxPrice", max);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      setProducts(data.data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [categories, prices]);

  // ✅ SORTING (client-side only)
  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sort) {
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [products, sort]);

  const selectedFilterCount = categories.length + prices.length;

  return (
    <>
      <MobileFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedCategories={categories}
        selectedPrices={prices}
      />

      <div className="flex gap-6">
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar
            selectedCategories={categories}
            selectedPrices={prices}
          />
        </div>

        <div className="flex-1 min-w-0">
          <Toolbar
            totalCount={sortedProducts.length}
            categoryLabel=""
            currentSort={sort}
            currentView={view}
            onFilterOpen={() => setDrawerOpen(true)}
            selectedFilterCount={selectedFilterCount}
          />

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : (
            <div
              className={
                view === "list"
                  ? "flex flex-col gap-2 sm:gap-4"
                  : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-1 sm:gap-4"
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}