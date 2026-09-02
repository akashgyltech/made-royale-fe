import React from "react";
import { notFound } from "next/navigation";
import RoomMain from "@/page-content/room/room-main";
import { getCategoryBySlug, getRoomCategories, getRoomProducts } from "@/lib/catalog";

// See shop-details/[slug]/page.jsx: every backend fetch here uses cache: 'no-store',
// so pre-rendering a fixed slug list conflicts with that at runtime for anything
// added after the last deploy. Force dynamic rendering instead.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const room = await getCategoryBySlug(slug);
    return {
        title: room ? `${room.name} Furniture — Shizenta` : "Shop by Room — Shizenta",
        description: room ? `${room.name}: ${room.tagline}. Handcrafted luxury furniture by Shizenta.` : undefined,
    };
}
export default async function RoomPage({ params }) {
    const { slug } = await params;
    const room = await getCategoryBySlug(slug);
    if (!room || !room.showInRoom)
        notFound();
    const [products, others] = await Promise.all([
        getRoomProducts(slug, 100),
        getRoomCategories(),
    ]);
    return <RoomMain room={room} products={products} otherRooms={others.filter((r) => r.slug !== slug)}/>;
}
