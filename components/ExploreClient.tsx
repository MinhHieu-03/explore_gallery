"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mockData } from "@/src/lib/mockData";
import SearchFilter from "./SearchFilterBar";

type Photo = {
  id: string;
  title: string;
  src: string;
  category: string;
  likes: number;
  createdAt: string;
};

const PAGE_LIMIT = 12;

export default function ExploreClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"trending" | "latest">("trending");

  const [items, setItems] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // reset khi thay đổi filter/sort
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedQuery, category, sort]);

  // fake fetch dữ liệu
  useEffect(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const stored = localStorage.getItem("customItems");
        const customItems = stored ? JSON.parse(stored) : [];
        let filtered = [...customItems, ...mockData];

        if (debouncedQuery)
          filtered = filtered.filter((p) =>
            p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
          );
        if (category !== "all")
          filtered = filtered.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );

        if (sort === "trending") filtered.sort((a, b) => b.likes - a.likes);
        else
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const start = (page - 1) * PAGE_LIMIT;
        const next = filtered.slice(start, start + PAGE_LIMIT);

        setItems((prev) => [...prev, ...next]);
        setHasMore(next.length === PAGE_LIMIT);
      } catch (err: any) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [debouncedQuery, category, sort, page]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && hasMore && !error) {
            setPage((p) => p + 1);
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [loading, hasMore, error]);

  return (
    <main className="p-6">
      <SearchFilter
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        onCreateClick={() => router.push("/create")}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p, index) => (
          <div
            key={`${p.id}-${index}`} // key duy nhất ngay cả khi id trùng
            onClick={() => router.push(`/item/${p.id}`)}
            className="bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-md transition"
          >
            <img
              src={p.src}
              alt={p.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-3">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <div className="text-xs text-gray-500 flex justify-between mt-1">
                <span>📁 {p.category}</span>
                <span>❤️ {p.likes}</span>
              </div>
            </div>
          </div>
        ))}

        {loading &&
          items.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded p-4">
              <div className="h-48 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
      </div>

      {error && <div className="mt-6 text-red-600">Error: {error}</div>}
      {loading && items.length > 0 && (
        <div className="text-center text-gray-500 mt-4">Loading more...</div>
      )}
      <div ref={sentinelRef} />
      {!hasMore && !loading && (
        <div className="text-center text-gray-400 mt-6">
          You have reached the end.
        </div>
      )}
    </main>
  );
}
