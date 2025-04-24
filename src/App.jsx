import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <div>
        <Header />
        <Hero />
        <AboutUs />
        <Services />
        <Contact />
      </div>
    </>
  );
}

export default App;
