import React from "react";
import Hero from "../components/Hero";
import Programs from "../components/Programs";
import Contact from "../components/Contact"; // Your Multi-step Form
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-black">
      {/* Each section gets an ID for the "Learn More" and "Start Training" buttons to scroll to */}
      <section id="home">
        <Hero />
      </section>

      <section id="programs" className="relative z-10">
        {/* We can add a subtle 3D transition spacer here */}
        <div className="h-20 bg-gradient-to-b from-black to-zinc-900/20" />
        <Programs />
      </section>

      <section id="membership" className="relative z-10 bg-zinc-50 dark:bg-black">
        <Contact />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;