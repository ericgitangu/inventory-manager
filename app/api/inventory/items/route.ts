import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure the prisma client is properly configured

export async function GET(req: NextRequest) {
  try {
    const items = await prisma.inventoryItem.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const items = await req.json();

    for (const item of items) {
      const existingItem = await prisma.inventoryItem.findUnique({
        where: { id: item.id },
      });

      if (existingItem) {
        await prisma.inventoryItem.update({
          where: { id: item.id },
          data: {
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            category: item.category,
            dateAdded: new Date(item.dateAdded),
            imageUrl: item.imageUrl || "",
          },
        });
      } else {
        await prisma.inventoryItem.create({
          data: {
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            category: item.category,
            dateAdded: new Date(item.dateAdded),
            imageUrl: item.imageUrl || "",
          },
        });
      }
    }

    return NextResponse.json({ message: "Inventory items processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving inventory items:", error);
    return NextResponse.json({ error: "Failed to save inventory items" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      console.log(`Item with id ${id} not found. No action taken.`);
      return NextResponse.json({ message: "Item not found. No action taken." }, { status: 200 });
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
