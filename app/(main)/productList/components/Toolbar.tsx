"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { useCallback } from "react";

const SORT_OPTIONS = [
  { label: "Low to High", value: "price_asc" },
  { label: "High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

type ToolbarProps = {
  totalCount: number;
  categoryLabel: string;
  currentSort: string;
  currentView: string;
  onFilterOpen: () => void;
  selectedFilterCount: number;
};

export default function Toolbar({
  totalCount,
  categoryLabel,
  currentSort,
  currentView,
  onFilterOpen,
  selectedFilterCount,
}: ToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900">
        Product List{" "}
        <span className="text-gray-400 font-normal text-base">
          ({totalCount})
        </span>
      </h1>

      {/* Right side controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Mobile filter button */}
        <button
          onClick={onFilterOpen}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors lg:hidden relative"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {selectedFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {selectedFilterCount}
            </span>
          )}
        </button>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:inline whitespace-nowrap">
            Sort by
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View toggle - desktop only */}
        <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => updateParam("view", "grid")}
            className={`p-2 transition-colors ${
              currentView === "grid"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateParam("view", "list")}
            className={`p-2 transition-colors ${
              currentView === "list"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}