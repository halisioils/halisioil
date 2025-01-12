import React from "react";
import Hero from "./LandingPage/Hero";
import Overview from "./LandingPage/Overview";
import Products from "./LandingPage/Products";

const LandingPage = () => {
  return (
    <section className="bg-white">
      <Hero />
      <Overview />
      <Products />
    </section>
  );
};

export default LandingPage;
