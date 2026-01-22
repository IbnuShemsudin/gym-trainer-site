/* client/src/App.jsx */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandTicker from "./components/BrandTicker";
import Programs from "./components/Programs";
import Trainers from "./components/Trainers";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Sync theme with <html> tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <ScrollProgress />
          <Navbar theme={theme} setTheme={setTheme} />
          
          <main>
            <section id="hero">
              <Hero />
            </section>
            
            <BrandTicker />

            <section id="programs">
              <Programs />
            </section>

            <section id="trainers">
              <Trainers />
            </section>

            <section id="gallery">
              <Gallery />
            </section>

            <section id="pricing">
              <Pricing />
            </section>

            <section id="contact">
              <Contact />
            </section>
          </main>

          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default App;