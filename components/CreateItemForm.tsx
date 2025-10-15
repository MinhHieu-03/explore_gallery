"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/src/lib/mockData";

export type FormState = {
  title: string;
  image: string;
  category: string;
  tags: string;
  description: string;
};

export default function CreateItemForm({
  onSubmit,
}: {
  onSubmit: (data: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>({
    title: "",
    image: "",
    category: "",
    tags: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isValidUrl = (v: string) => /^https?:\/\/\S+\.\S+/.test(v);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.image.trim()) newErrors.image = "Image URL is required.";
    else if (!isValidUrl(form.image.trim()))
      newErrors.image = "Please enter a valid URL.";
    if (!form.category.trim()) newErrors.category = "Category is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const copy = { ...errors };
      delete copy[name];
      setErrors(copy);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    onSubmit(form);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-medium">
          Title *
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${
            errors.title ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block font-medium">Image URL *</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className={`border p-2 w-full rounded ${
            errors.image ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block font-medium">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${
            errors.category ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block font-medium">Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="border p-2 w-full rounded border-gray-300"
          placeholder="e.g. beach, sunset"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block font-medium">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={`border p-2 w-full rounded ${
            errors.description ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
        <Link href="/" className="text-blue-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
