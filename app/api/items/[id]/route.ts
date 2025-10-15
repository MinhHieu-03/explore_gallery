import { NextRequest, NextResponse } from "next/server";
import { items } from "../route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = items.find((i) => i.id === id);

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const item = items.find((i) => i.id === id);

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  item.likes = (item.likes || 0) + 1;
  return NextResponse.json(item);
}
