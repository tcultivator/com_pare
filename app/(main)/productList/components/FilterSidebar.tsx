"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FILTER_OPTIONS } from "../data/mockProducts";

type FilterSidebarProps = {
  selectedCategories: string[];
  selectedPrices: string[];
  className?: string;
};

export default function FilterSidebar({
  selectedCategories,
  selectedPrices,
  className = "",
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleValue = (
    current: string[],
    value: string,
    paramKey: string
  ) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(paramKey, updated);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categories");
    params.delete("prices");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasFilters =
    selectedCategories.length > 0 || selectedPrices.length > 0;

  return (
    <aside
      className={`bg-white rounded-2xl border border-gray-100 p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span className="font-semibold text-gray-800 text-sm">Filter</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ✅ Categories */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {FILTER_OPTIONS.categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() =>
                  toggleValue(selectedCategories, category, "categories")
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`text-sm transition-colors ${
                  selectedCategories.includes(category)
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {category.toUpperCase().replace("_", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Price */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Price
        </p>
        <div className="flex flex-col gap-2">
          {FILTER_OPTIONS.priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedPrices.includes(range.label)}
                onChange={() =>
                  toggleValue(selectedPrices, range.label, "prices")
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`text-sm transition-colors ${
                  selectedPrices.includes(range.label)
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}