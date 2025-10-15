import { NextResponse } from "next/server";
export interface Item {
  id: string;
  title: string;
  category?: string;
  likes?: number;
}

export const items: Item[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  const newItem = { id: Date.now().toString(), likes: 0, ...body };
  items.push(newItem);
  return NextResponse.json(newItem, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const result = category
    ? items.filter((i) => i.category === category)
    : items;

  return NextResponse.json(result);
}
