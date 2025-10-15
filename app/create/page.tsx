"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateItemForm from "@/components/CreateItemForm";
import type { FormState } from "@/components/CreateItemForm";
import { Photo } from "@/src/lib/mockData";

type CreateItemPayload = Omit<Photo, "id" | "likes" | "source">;

export default function CreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: async (payload: CreateItemPayload): Promise<Photo> => {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Failed to create item");
      }

      return res.json();
    },
    onSuccess: (data: Photo) => {
      const stored = localStorage.getItem("customItems");
      const customItems: Photo[] = stored ? JSON.parse(stored) : [];
      customItems.push(data);
      localStorage.setItem("customItems", JSON.stringify(customItems));

      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.push(`/detail/${data.id}`);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) alert(err.message);
      else alert("Something went wrong");
    },
  });

  const handleSubmit = (form: FormState) => {
    const payload: CreateItemPayload = {
      title: form.title.trim(),
      src: form.image.trim(),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: form.description.trim(),
      author: "You",
      createdAt: new Date().toISOString(),
    };

    createItemMutation.mutate(payload);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Item</h1>
      <CreateItemForm onSubmit={handleSubmit} />
    </main>
  );
}
