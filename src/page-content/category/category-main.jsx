import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CategoryLanding from "@/components/category/category-landing";
const CategoryMain = (props) => {
    return (<Wrapper>
      <HeaderSix transparent/>
      <main>
        <CategoryLanding {...props}/>
      </main>
      <FooterSix />
    </Wrapper>);
};
export default CategoryMain;
