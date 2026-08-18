"use client";
import React from "react";
import BackToTop from "@/components/back-to-top";
if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap.bundle.min");
}
const Wrapper = ({ children, showBackToTop = true }) => {
    return (<React.Fragment>
      {children}
      {showBackToTop && <BackToTop />}
    </React.Fragment>);
};
export default Wrapper;
