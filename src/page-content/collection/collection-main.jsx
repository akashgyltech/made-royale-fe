import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CollectionLanding from "@/components/collection/collection-landing";
const CollectionMain = ({ collection, products, otherCollections }) => {
    return (<Wrapper>
      <HeaderSix transparent/>
      <main>
        <CollectionLanding collection={collection} products={products} otherCollections={otherCollections}/>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default CollectionMain;
