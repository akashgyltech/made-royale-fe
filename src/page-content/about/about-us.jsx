import Wrapper from "@/layouts/wrapper";
import HeaderSix from "@/layouts/headers/header-six";
import FooterSix from "@/layouts/footers/footer-six";
import AboutLanding from "@/components/about/about-landing";
const AboutUsMain = () => {
    return (<Wrapper>
      <HeaderSix transparent/>
      <main>
        <AboutLanding />
      </main>
      <FooterSix />
    </Wrapper>);
};
export default AboutUsMain;
