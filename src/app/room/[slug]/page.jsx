import React from "react";
import { notFound } from "next/navigation";
import RoomMain from "@/page-content/room/room-main";
import { getCategoryBySlug, getRoomCategories, getRoomProducts } from "@/lib/catalog";

export async function generateStaticParams() {
    const rooms = await getRoomCategories();
    return rooms.map((r) => ({ slug: r.slug }));
}
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
