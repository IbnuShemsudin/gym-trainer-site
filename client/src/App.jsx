import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// 1. GLOBAL COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";

// 2. PAGE COMPONENTS (Wrap your existing components into these)
import Hero from "./components/Hero";
import BrandTicker from "./components/BrandTicker";
import Programs from "./components/Programs";
import Trainers from "./components/Trainers";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";

// 3. ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard"; 
import Login from "./pages/Login";
import About from "./pages/About"

// SCROLL RESTORATION: Forces page to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// PAGE WRAPPER: For consistent "Elite" entry animations
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // THEME LOGIC
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

  // INITIAL LOADER
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-zinc-950 dark:bg-black transition-colors duration-700 selection:bg-red-600 selection:text-white">
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loader" />
          ) : (
            <>
              {/* Common UI Elements visible on all public pages */}
              <ScrollProgress />
              <Navbar theme={theme} setTheme={setTheme} />

              <AnimatePresence mode="wait">
                <Routes>
                  {/* HOME PAGE: Hero & Brand Ticker only */}
                  <Route path="/" element={
                    <PageWrapper>
                      <Hero />
                      <BrandTicker />
                      <Trainers /> {/* Added trainers here as they fit the home vibe */}
                    </PageWrapper>
                  } />

                  {/* DEDICATED PAGES */}
                  <Route path="/programs" element={
                    <PageWrapper>
                      <div className="pt-20"><Programs /></div>
                    </PageWrapper>
                  } />

              <Route path="/about" element={
                <PageWrapper>
                  <div className="pt-20"><About /></div>
                </PageWrapper>
              } />

                  <Route path="/gallery" element={
                    <PageWrapper>
                      <div className="pt-20"><Gallery /></div>
                    </PageWrapper>
                  } />

                  <Route path="/pricing" element={
                    <PageWrapper>
                      <div className="pt-20"><Pricing /></div>
                    </PageWrapper>
                  } />

                  <Route path="/contact" element={
                    <PageWrapper>
                      <div className="pt-20"><Contact /></div>
                    </PageWrapper>
                  } />

                  {/* ADMIN & AUTH (Hidden Navbar/Footer is usually better for Admin) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </AnimatePresence>

              <Footer />
            </>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;