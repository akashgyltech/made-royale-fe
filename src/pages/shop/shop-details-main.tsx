"use client";
import Link from "next/link";
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import ProductDetail from "@/components/shop/details/product-detail";
import { getProduct } from "@/data/catalog";

const ShopDetailsMain = ({ slug }: { slug: string }) => {
  const product = getProduct(slug);
  return (
    <Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        {product ? (
          <ProductDetail product={product} />
        ) : (
          <div className="mr-shop-empty" style={{ padding: "120px 20px" }}>
            <div className="mr-shop-empty-glyph">❖</div>
            <h3>This piece could not be found</h3>
            <p>It may have moved to another gallery.</p>
            <Link href="/shop" className="mr-btn-solid">Browse the collection</Link>
          </div>
        )}
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default ShopDetailsMain;
