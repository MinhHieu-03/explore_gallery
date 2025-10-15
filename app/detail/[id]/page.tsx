"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { mockData } from "@/src/lib/mockData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export type Photo = {
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
  const [item, setItem] = useState<Photo | null>(null);
  const [related, setRelated] = useState<Photo[]>([]);
  const [likes, setLikes] = useState<number>(0);

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (item: Photo) => {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, likes: item.likes + 1 }),
      });
    },
    onMutate: async (item: Photo) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const previous = queryClient.getQueryData<Photo[]>(["items"]);
      queryClient.setQueryData<Photo[]>(["items"], (old = []) =>
        old.map((i) => (i.id === item.id ? { ...i, likes: i.likes + 1 } : i))
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

    const allItems: Photo[] = [
      ...customItems.map((i) => ({ ...i, source: "custom" as const })),
      ...mockData.map((i) => ({ ...i, source: "mock" as const })),
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
  }, [id, router]);

  if (!item) return <div className="p-6">Loading...</div>;

  const likeItem = (item: Photo) => {
    const updatedItem: Photo = { ...item, likes: item.likes + 1 };
    setItem(updatedItem);
    setLikes(updatedItem.likes);

    if (item.source === "custom") {
      const stored = localStorage.getItem("customItems");
      const customItems: Photo[] = stored ? JSON.parse(stored) : [];
      const updatedList = customItems.map((i) =>
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
      <Image
        src={item.src}
        alt={item.title}
        width={700} 
        height={340} 
        className="w-full h-60 object-cover"
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
            <Image
              src={r.src}
              alt={r.title}
              width={400}
              height={240}
              className="w-full h-60 object-cover"
            />
            <p className="text-sm mt-1">{r.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
