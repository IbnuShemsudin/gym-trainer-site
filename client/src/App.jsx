import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// GLOBAL COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import GrainOverlay from "./components/GrainOverlay";

// PAGE COMPONENTS
import Hero from "./components/Hero";
import BrandTicker from "./components/BrandTicker";
import Programs from "./components/Programs";
import Trainers from "./components/Trainers";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import About from "./pages/About";
import Services from "./pages/Services"; 

import AdminDashboard from "./pages/AdminDashboard"; 
import Login from "./pages/Login";
import Register from "./pages/Register"; 

// --- HELPER: SCROLL TO TOP ON NAVIGATION ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- FIX 1: ROLE-BASED PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// --- ANIMATION WRAPPER FOR PAGES ---
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

// --- 404 NOT FOUND PAGE ---
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <h1 className="text-9xl font-black text-red-600 italic tracking-tighter">404</h1>
        <p className="text-zinc-500 uppercase font-bold tracking-[0.3em] mt-4">System Path Not Found</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-8 px-8 py-3 bg-red-600 text-white font-black uppercase italic rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
        >
          Return to Base
        </button>
      </div>
    </PageWrapper>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [selectedPlan, setSelectedPlan] = useState("");

  // --- THEME SYNC ENGINE ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- INITIAL SYSTEM BOOT (LOADER) ---
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <CustomCursor />
      <GrainOverlay />
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-700">
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loader" />
          ) : (
            <MainContent 
              theme={theme} 
              setTheme={setTheme} 
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

function MainContent({ theme, setTheme, selectedPlan, setSelectedPlan }) {
  const location = useLocation();
  
  // Define layout constraints
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const hideNavFooter = isAdminPage || isAuthPage;

  return (
    <>
      {/* GLOBAL UI ELEMENTS */}
      {!hideNavFooter && <ScrollProgress />}
      {!hideNavFooter && <Navbar theme={theme} setTheme={setTheme} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* LANDING & GENERAL PAGES */}
          <Route path="/" element={<PageWrapper><Hero /><BrandTicker /><Trainers /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/programs" element={<PageWrapper><div className="pt-20"><Programs /></div></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><div className="pt-20"><About /></div></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><div className="pt-20"><Gallery /></div></PageWrapper>} />
          
          <Route path="/pricing" element={
            <PageWrapper>
              <div className="pt-20">
                <Pricing setSelectedPlan={setSelectedPlan} />
              </div>
            </PageWrapper>
          } />

          <Route path="/contact" element={
            <PageWrapper>
              <div className="pt-20">
                <Contact initialPlan={selectedPlan} />
              </div>
            </PageWrapper>
          } />

          {/* AUTHENTICATION */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* SECURE COMMAND CENTER */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* CATCH-ALL 404 */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </AnimatePresence>

      {!hideNavFooter && <Footer />}
    </>
  );
}

export default App;