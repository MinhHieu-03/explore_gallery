"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockData } from "@/src/lib/mockData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

type Photo = {
  id: string;
  title: string;
  src: string;
  category: string;
  likes: number;
  createdAt: string;
  author?: string;
  description?: string;
  tags?: string[];
  source?: "mock" | "custom";
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [likes, setLikes] = useState<number>(0);

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (item: any) => {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, likes: item.likes + 1 }),
      });
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      const previous = queryClient.getQueryData(["items"]);

      queryClient.setQueryData(["items"], (old: any) =>
        old.map((i: any) =>
          i.id === item.id ? { ...i, likes: i.likes + 1 } : i
        )
      );

      return { previous };
    },
    onError: (_err, _item, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["items"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem("customItems");
    const customItems: Photo[] = stored ? JSON.parse(stored) : [];

    const allItems = [
      ...customItems.map((i) => ({ ...i, source: "custom" })),
      ...mockData.map((i) => ({ ...i, source: "mock" })),
    ];

    const found = allItems.find((x) => x.id === id);

    if (!found) {
      router.push("/");
      return;
    }

    setItem(found);
    setLikes(found.likes);
    setRelated(
      allItems.filter((x) => x.category === found.category && x.id !== found.id)
    );
  }, [id]);

  if (!item) return <div className="p-6">Loading...</div>;

  const likeItem = (item: any) => {
    const updatedItem = { ...item, likes: item.likes + 1 };
    setItem(updatedItem);
    setLikes(updatedItem.likes);

    if (item.source === "custom") {
      const stored = localStorage.getItem("customItems");
      const customItems = stored ? JSON.parse(stored) : [];
      const updatedList = customItems.map((i: any) =>
        i.id === item.id ? updatedItem : i
      );
      localStorage.setItem("customItems", JSON.stringify(updatedList));
    } else {
      likeMutation.mutate(item);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <button className="text-sm text-blue-600 hover:underline mb-4">
        <Link href={"/"}>← home</Link>
      </button>
      <img
        src={item.src}
        alt={item.title}
        className="w-full h-96 object-cover rounded-lg mb-4"
      />

      <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
      <p className="text-sm text-gray-600">👤 {item.author}</p>
      <div className="flex items-center gap-4 text-gray-600 mb-4">
        <span className="text-sm">📁 {item.category}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            likeItem(item);
          }}
          className="hover:text-pink-600"
        >
          ❤️ {likes}
        </button>
      </div>

      <p className="text-gray-700 leading-relaxed mb-8">
        {item.description || "No description available."}
      </p>

      <h2 className="text-xl font-semibold mb-3">More from this category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {related.slice(0, 6).map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/item/${r.id}`)}
            className="cursor-pointer"
          >
            <img
              src={r.src}
              alt={r.title}
              className="w-full h-40 object-cover rounded"
            />
            <p className="text-sm mt-1">{r.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
