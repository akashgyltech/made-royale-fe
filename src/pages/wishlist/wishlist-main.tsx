"use client";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import LuxBreadcrumb from "@/components/ui/lux-breadcrumb";
import ShopItem from "@/components/shop/shop-item";
import { useWishlist } from "@/provider/WishlistProvider";

const WishlistMain = () => {
  const { products, clear } = useWishlist();

  return (
    <Wrapper>
      <HeaderSix />
      <main>
        <LuxBreadcrumb subtitle="Saved for Later" title="My Wishlist" crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
        <section className="mr-wishlist">
          <div className="container container-1500">
            {products.length === 0 ? (
              <div className="mr-shop-empty">
                <div className="mr-shop-empty-glyph">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save the pieces you love and revisit them anytime.</p>
                <Link href="/shop" className="mr-btn-solid">Explore the Collection</Link>
              </div>
            ) : (
              <>
                <div className="mr-wishlist-top">
                  <span>{products.length} {products.length === 1 ? "piece" : "pieces"} saved</span>
                  <button className="mr-shop-clear" onClick={clear}>Clear wishlist</button>
                </div>
                <div className="mr-grid mr-grid-4">{products.map((p) => <ShopItem key={p.id} product={p} />)}</div>
              </>
            )}
          </div>
        </section>
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default WishlistMain;
