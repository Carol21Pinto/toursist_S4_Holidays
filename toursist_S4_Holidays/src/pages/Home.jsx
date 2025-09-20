import React, { useEffect } from "react";
import Hero from "../components/Hero.jsx";
import Description from "../components/Description.jsx";
import TripCategories from "../components/TripCategories.jsx";
import ContactIcons from "../components/ContactIcons.jsx";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <Description />
      <TripCategories />
      <ContactIcons />
    </>
  );
}
