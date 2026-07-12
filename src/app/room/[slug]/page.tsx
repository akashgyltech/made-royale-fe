import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RoomMain from "@/pages/room/room-main";
import { getRoom, rooms } from "@/data/catalog";

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

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getRoom(slug)) notFound();
  return <RoomMain slug={slug} />;
}
