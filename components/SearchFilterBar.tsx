"use client";

import React from "react";

type ExploreFilterProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: "trending" | "latest";
  onSortChange: (value: "trending" | "latest") => void;
  onCreateClick: () => void;
};

const CATEGORIES = ["Nature", "City", "People", "Food", "Animals"];

export default function SearchFilter({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  onCreateClick,
}: ExploreFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="w-full sm:w-1/2">
        <label htmlFor="search" className="sr-only">
          Search by title
        </label>
        <input
          id="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title..."
          className="p-2 border rounded w-full"
          aria-label="Search by title"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category" className="sr-only">
          Filter by category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="p-2 border rounded"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="sort" className="sr-only">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) =>
            onSortChange(e.target.value as "trending" | "latest")
          }
          className="p-2 border rounded"
          aria-label="Sort by"
        >
          <option value="trending">Trending</option>
          <option value="latest">Latest</option>
        </select>
      </div>
      {/* Nút Create */}
      <button
        onClick={onCreateClick}
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Create
      </button>
    </div>
  );
}
