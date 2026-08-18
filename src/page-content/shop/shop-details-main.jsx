import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import ProductDetail from "@/components/shop/details/product-detail";
const ShopDetailsMain = ({ product, initialReviews, related }) => {
    return (<Wrapper>
      <HeaderSix />
      <main className="mr-page-pt">
        <ProductDetail product={product} initialReviews={initialReviews} related={related}/>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default ShopDetailsMain;
