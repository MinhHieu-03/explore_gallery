import { NextResponse } from "next/server";

export let items: any[] = []; // ✅ Mảng tạm để lưu dữ liệu

// Tạo item mới
export async function POST(req: Request) {
  const body = await req.json();
  const newItem = { id: Date.now().toString(), likes: 0, ...body };
  items.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}

// Lấy toàn bộ item (hoặc lọc theo category)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const result = category
    ? items.filter((i) => i.category === category)
    : items;

  return NextResponse.json(result);
}
