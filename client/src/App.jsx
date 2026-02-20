import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Added Routing
import { AnimatePresence, motion } from "framer-motion";

// Existing Components
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

// New Admin Components
import AdminDashboard from "./pages/AdminDashboard"; 
import Login from "./pages/Login";

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#000000"; 
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // WE CREATE A WRAPPER FOR THE LANDING PAGE CONTENT
  const LandingPage = () => (
    <>
      <ScrollProgress />
      <Navbar theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        <BrandTicker />
        <Programs />
        <Trainers />
        <Gallery />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 dark:bg-black transition-colors duration-700 selection:bg-red-600 selection:text-white">
        <AnimatePresence mode="wait">
          {loading && <LoadingScreen key="loader" />}
        </AnimatePresence>

        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Routes>
              {/* PUBLIC LANDING PAGE */}
              <Route path="/" element={<LandingPage />} />

              {/* PRIVATE ADMIN ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </motion.div>
        )}
      </div>
    </Router>
  );
}

export default App;