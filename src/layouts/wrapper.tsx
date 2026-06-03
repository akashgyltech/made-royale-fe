"use client";
import React from "react";
import BackToTop from "@/components/back-to-top";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap.bundle.min");
}

interface WrapperProps {
  children: React.ReactNode;
  showBackToTop?: boolean;
}

const Wrapper = ({ children, showBackToTop=true }: WrapperProps) => {
  return (
    <React.Fragment>
      {children}
      {showBackToTop && <BackToTop />}
    </React.Fragment>
  );
};

export default Wrapper;
