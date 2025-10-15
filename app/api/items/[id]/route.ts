import { NextResponse } from "next/server";
import { items } from "../route";

// Lấy chi tiết item theo id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const item = items.find((i) => i.id === params.id);
  if (!item)
    return NextResponse.json({ message: "Item not found" }, { status: 404 });

  return NextResponse.json(item);
}

// Tăng số like (optimistic update)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const item = items.find((i) => i.id === params.id);
  if (!item)
    return NextResponse.json({ message: "Item not found" }, { status: 404 });

  item.likes = (item.likes || 0) + 1;
  return NextResponse.json(item);
}
