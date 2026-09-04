"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import ShopItem from "@/components/shop/shop-item";
import { formatINR } from "@/data/catalog";
import { useWishlist } from "@/provider/WishlistProvider";
import { useCart } from "@/provider/CartProvider";

const SORTS = [
    { id: "saved", label: "As Saved" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
];

const WishlistMain = () => {
    const { products, loading, clear } = useWishlist();
    const { addManyToCart } = useCart();
    const [sortBy, setSortBy] = useState("saved");
    const [confirmingClear, setConfirmingClear] = useState(false);

    const sorted = useMemo(() => {
        if (sortBy === "price-asc") return [...products].sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") return [...products].sort((a, b) => b.price - a.price);
        return products;
    }, [products, sortBy]);

    const totalValue = useMemo(() => products.reduce((sum, p) => sum + p.price, 0), [products]);
    const inStockProducts = useMemo(() => products.filter((p) => p.stock > 0), [products]);
    const outOfStockCount = products.length - inStockProducts.length;

    const addAllToCart = () => {
        if (inStockProducts.length === 0) return;
        addManyToCart(inStockProducts.map((p) => ({ id: p.id, qty: 1, color: p.colors[0]?.name })));
    };

    const handleClear = () => {
        if (!confirmingClear) {
            setConfirmingClear(true);
            setTimeout(() => setConfirmingClear(false), 3000);
            return;
        }
        setConfirmingClear(false);
        clear();
    };

    return (<Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Saved for Later" title="My Wishlist" crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} image="/images/shizenta-account-bg.webp"/>
        <section className="mr-wishlist">
          <div className="container container-1500">
            {loading ? (<div className="mr-grid mr-grid-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="mr-wishlist-skeleton"/>)}
              </div>) : products.length === 0 ? (<div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save the pieces you love and revisit them anytime.</p>
                <Link href="/shop" className="mr-btn-solid">Explore the Collection</Link>
              </div>) : (<>
                <div className="mr-wishlist-top">
                  <div className="mr-wishlist-top-info">
                    <span>{products.length} {products.length === 1 ? "piece" : "pieces"} saved</span>
                    <strong>{formatINR(totalValue)} total value</strong>
                  </div>
                  <div className="mr-wishlist-top-actions">
                    {outOfStockCount > 0 && <span className="mr-wishlist-oos-note">{outOfStockCount} unavailable</span>}
                    <select className="mr-wishlist-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort wishlist">
                      {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                    <button className="mr-btn-outline mr-btn-sm" onClick={addAllToCart} disabled={inStockProducts.length === 0}>Add All to Cart</button>
                    <button className={`mr-shop-clear ${confirmingClear ? "is-confirm" : ""}`} onClick={handleClear}>{confirmingClear ? "Click to confirm" : "Clear wishlist"}</button>
                  </div>
                </div>
                <div className="mr-grid mr-grid-4">
                  {sorted.map((p) => (<div key={p.id} className={`mr-wishlist-card ${p.stock <= 0 ? "is-oos" : ""}`}>
                      {p.stock <= 0 && <span className="mr-wishlist-oos">Out of Stock</span>}
                      <ShopItem product={p}/>
                    </div>))}
                </div>
              </>)}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default WishlistMain;
