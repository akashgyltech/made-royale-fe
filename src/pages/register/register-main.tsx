"use client";
import { gsap } from "gsap";
import Link from "next/link";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText } from "@/plugins";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import FooterSix from "@/layouts/footers/footer-six";
import RegisterForm from "@/components/form/register-form";
import SocialLogin from "@/components/form/social-login";
import HeaderSix from "@/layouts/headers/header-six";

const RegisterMain = () => {
  useScrollSmooth();

  return (
    <Wrapper>
      <HeaderSix />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* register area */}
            <section className="tp-login-area pt-180 pb-140 p-relative z-index-1 fix">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-6 col-lg-8">
                    <div className="tp-login-wrapper">
                      <div className="tp-login-top text-center mb-30">
                        <h3 className="tp-login-title">Sign Up Shizenta.</h3>
                        <p>
                          Don’t have an account?{" "}
                          <span>
                            <Link href="/login">Sign In</Link>
                          </span>
                        </p>
                      </div>
                      <div className="tp-login-option">
                        <SocialLogin />
                        <div className="tp-login-mail text-center mb-40">
                          <p>
                            or Sign in with <Link href="#">Email</Link>
                          </p>
                        </div>
                        {/* register form */}
                        <RegisterForm />
                        {/* register form */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* register area */}
          </main>

          {/* footer area */}
          <FooterSix />
          {/* footer area */}
        </div>
      </div>
    </Wrapper>
  );
};

export default RegisterMain;
