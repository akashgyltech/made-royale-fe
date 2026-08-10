import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import HeaderSix from "@/layouts/headers/header-six";
import CategoryLanding from "@/components/category/category-landing";
import type { Category, Product } from "@/data/catalog";

interface CategoryMainProps {
  category: Category;
  featuredProducts: Product[];
  totalInCategory: number;
  priceFrom: number;
  subCategoryCounts: Record<string, number>;
  otherCategories: Category[];
}

const CategoryMain = (props: CategoryMainProps) => {
  return (
    <Wrapper>
      <HeaderSix transparent />
      <main>
        <CategoryLanding {...props} />
      </main>
      <FooterSix />
    </Wrapper>
  );
};

export default CategoryMain;
