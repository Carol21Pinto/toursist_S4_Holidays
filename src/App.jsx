import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import TripCategories from "./components/TripCategories.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <TripCategories /> {/* New Section */}
    </div>
  );
}

export default App;
