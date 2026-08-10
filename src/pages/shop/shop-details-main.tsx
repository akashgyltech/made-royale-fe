import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import ProductDetail from "@/components/shop/details/product-detail";
import type { Product } from "@/data/catalog";
import type { BackendReview } from "@/types/backend";

interface ShopDetailsMainProps {
  product: Product;
  initialReviews: BackendReview[];
  related: Product[];
}

const ShopDetailsMain = ({ product, initialReviews, related }: ShopDetailsMainProps) => {
  return (
    <Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        <ProductDetail product={product} initialReviews={initialReviews} related={related} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default ShopDetailsMain;
