import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CollectionLanding from "@/components/collection/collection-landing";
import type { Collection, Product } from "@/data/catalog";

const CollectionMain = ({ collection, products }: { collection: Collection; products: Product[] }) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <CollectionLanding collection={collection} products={products} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default CollectionMain;
