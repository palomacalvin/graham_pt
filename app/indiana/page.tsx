import React from "react";
import Navbar from "@/components/Navbar";
import FooterComp from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export default function IndianaPage() {
  return (
    <>
    <Navbar></Navbar>
    <div style={{ margin: "3rem" }}>
      <h1>Indiana Page</h1>

      <h2>Under Construction</h2>
    </div>

    <FooterComp />
    <Analytics />
    </>
  );
}
