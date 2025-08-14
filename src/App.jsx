import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TripCategories from "./components/TripCategories.jsx";
import ContactIcons from "./components/ContactIcons.jsx";
import Description from "./components/Description.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <ContactIcons />
      <Description />
      <TripCategories /> {/* New Section */}
    </div>
  );
}

export default App;
