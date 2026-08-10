import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomMain from "@/pages/room/room-main";
import { getRoom, rooms, getRoomProducts, getCategories } from "@/lib/catalog";
import type { Category, Room } from "@/data/catalog";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  return {
    title: room ? `${room.name} Furniture — Shizenta` : "Shop by Room — Shizenta",
    description: room ? `${room.name}: ${room.tagline}. Handcrafted luxury furniture by Shizenta.` : undefined,
  };
}

// Categories belonging to a room = any real category whose slug (or one of its
// subcategory slugs) is listed on the room's static editorial config.
function roomCategories(allCategories: Category[], room: Room): Category[] {
  const slugs = new Set(room.categories);
  allCategories.forEach((c) => {
    if (c.subcategories.some((s) => room.subs?.includes(s.slug))) slugs.add(c.slug);
  });
  return allCategories.filter((c) => slugs.has(c.slug));
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();

  const [products, allCategories] = await Promise.all([
    getRoomProducts(slug, 100),
    getCategories(),
  ]);

  return <RoomMain room={room} products={products} cats={roomCategories(allCategories, room)} />;
}
