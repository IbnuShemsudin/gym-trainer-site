import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added for Routing
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon, ArrowRight, Zap, Instagram, Twitter, Youtube } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const location = useLocation(); // Detection of current page
  const navigate = useNavigate();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Section detection now only relevant if you want to track scroll on long pages
      if (location.pathname === "/") {
        const sections = ["hero", "programs", "gallery", "pricing", "contact"];
        const current = sections.find(section => {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // UPDATED: All links are now true routes
  const navLinks = [
    { name: "Home", href: "/", id: "hero" },
    { name: "Programs", href: "/programs", id: "programs" },
    { name: "Gallery", href: "/gallery", id: "gallery" },
    { name: "Pricing", href: "/pricing", id: "pricing" },
    { name: "Contact", href: "/contact", id: "contact" },
    { name: "About", href: "/about", id: "about" },
  ];

  const programs = [
    { title: "Strength Training", desc: "Build elite muscle mass" },
    { title: "HIIT Cardio", desc: "Burn fat in record time" },
    { title: "Yoga & Flex", desc: "Recovery for athletes" },
    { title: "Personal Coaching", desc: "1-on-1 expert guidance" },
  ];

  // UPDATED: Now handles page navigation instead of smooth scrolling
  const handleNavClick = (href) => {
    setMenuOpen(false);
    navigate(href);
  };

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-red-600 z-[70] origin-left" style={{ scaleX }} />

      <div className="fixed top-0 left-0 w-full z-50 flex justify-center p-4 md:p-6 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-7xl px-6 py-2.5 rounded-2xl border transition-all duration-500 ${
            scrolled 
              ? "bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-zinc-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
              : "bg-transparent border-transparent"
          }`}
        >
          {/* LEFT — LOGO */}
          <div className="flex-1 flex justify-start">
            <Link 
              to="/"
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="cursor-pointer group no-underline"
            >
              <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 dark:text-white uppercase">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded italic group-hover:bg-red-700 transition-colors">S</span>
                <span className="hidden sm:inline italic">WEAT<span className="text-red-600">BOX</span></span>
              </h1>
            </Link>
          </div>

          {/* CENTER — NAV LINKS */}
          <div className="hidden lg:flex flex-[2] justify-center">
            <ul className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.15em] dark:text-zinc-400 text-zinc-500">
              {navLinks.map((link) => (
                <li key={link.name} className="relative px-4 py-2 cursor-pointer group">
                  <Link 
                    to={link.href}
                    className={`transition-colors duration-300 ${location.pathname === link.href ? "text-red-600" : "hover:text-black dark:hover:text-white"}`}
                  >
                    {link.name}
                  </Link>
                  {location.pathname === link.href && (
                    <motion.span 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              ))}

              {/* PROGRAMS DROPDOWN */}
              <li
                className="relative px-4 py-2 cursor-pointer group"
                onMouseEnter={() => setActiveDropdown(true)}
                onMouseLeave={() => setActiveDropdown(false)}
              >
                <div className={`flex items-center gap-1 transition-colors ${activeDropdown ? "text-red-600" : ""}`}>
                  Programs <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {activeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    >
                      <div className="w-72 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                        {programs.map((prog) => (
                          <div key={prog.title} className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                            <div className="p-2 rounded-lg bg-red-600/10 text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                              <Zap size={16} />
                            </div>
                            <div>
                              <div className="text-sm font-bold dark:text-white mb-0.5">{prog.title}</div>
                              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{prog.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-red-600/50 transition-all text-zinc-600 dark:text-white"
            >
              {theme === "dark" ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
            </button>

            <Link to="/login" className="hidden xl:block text-[10px] font-black uppercase tracking-widest dark:text-zinc-500 hover:text-red-600 transition-colors mr-2">
              Login
            </Link>

            <motion.button
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] items-center gap-2 shadow-lg shadow-red-600/20"
            >
              Train Now
            </motion.button>

            {/* HAMBURGER TRIGGER */}
            <button className="lg:hidden dark:text-white p-2 relative z-50 pointer-events-auto" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </motion.nav>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden pointer-events-auto"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-zinc-50 dark:bg-zinc-950 z-[110] lg:hidden p-8 flex flex-col shadow-2xl border-l border-zinc-200 dark:border-white/10 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Navigation</span>
                <button onClick={() => setMenuOpen(false)} className="dark:text-white">
                  <X size={28} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left text-3xl font-black uppercase italic tracking-tighter transition-colors ${
                      location.pathname === link.href ? "text-red-600" : "text-zinc-800 dark:text-white"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="text-left text-3xl font-black uppercase italic tracking-tighter text-zinc-400"
                >
                  Admin
                </Link>
              </nav>

              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/5">
                <p className="font-black text-[10px] uppercase tracking-widest text-zinc-400 mb-6">Follow the hustle</p>
                <div className="flex gap-4">
                  <a href="#" className="p-3 rounded-full bg-zinc-100 dark:bg-white/5 dark:text-white hover:text-red-600 transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="p-3 rounded-full bg-zinc-100 dark:bg-white/5 dark:text-white hover:text-red-600 transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="p-3 rounded-full bg-zinc-100 dark:bg-white/5 dark:text-white hover:text-red-600 transition-colors"><Youtube size={20} /></a>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => handleNavClick('/contact')}
                  className="w-full bg-red-600 py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
                >
                  Join the Forge <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;