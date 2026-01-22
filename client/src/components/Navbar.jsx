import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon, ArrowRight } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Sync theme with document root
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Scroll effect for glassmorphism transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

        const navLinks = [
        { name: "Home", href: "#hero" },
        { name: "Programs", href: "#programs" },
        { name: "Gallery", href: "#gallery" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "#contact" },
        ];

  const programs = [
    "Strength Training",
    "HIIT Cardio",
    "Yoga & Flex",
    "Personal Coaching",
  ];

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`pointer-events-auto flex items-center justify-between w-full max-w-7xl px-6 py-3 rounded-2xl border transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 dark:bg-black/70 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-2xl" 
            : "bg-transparent border-transparent"
        }`}
      >
        {/* LEFT — LOGO */}
        <div className="flex-1 flex justify-start">
          <motion.div 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            whileHover={{ scale: 1.05 }} 
            className="cursor-pointer"
          >
            <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 dark:text-white">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded">S</span>
              <span className="hidden sm:inline">WEAT<span className="text-red-600">BOX</span></span>
            </h1>
          </motion.div>
        </div>

        {/* CENTER — NAV LINKS */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] dark:text-zinc-300 text-zinc-600">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group cursor-pointer">
                <a 
                  href={link.href} 
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="hover:text-red-600 transition-colors"
                >
                  {link.name}
                </a>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
              </li>
            ))}

            {/* PROGRAMS DROPDOWN */}
            <li
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setActiveDropdown(true)}
              onMouseLeave={() => setActiveDropdown(false)}
            >
              <div className="flex items-center gap-1 group-hover:text-red-600 transition-colors">
                Programs <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown ? "rotate-180" : ""}`} />
              </div>
              <AnimatePresence>
                {activeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-3 grid gap-1">
                      {programs.map((prog) => (
                        <div key={prog} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group/item">
                          <span className="text-sm font-bold dark:text-zinc-200">{prog}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-red-600" />
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
        <div className="flex-1 flex items-center justify-end gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all text-zinc-600 dark:text-white"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <motion.button
            onClick={() => scrollToSection('#pricing')}
            whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(220, 38, 38, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:flex bg-red-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest items-center gap-2"
          >
            Train Now
          </motion.button>

          <button className="lg:hidden dark:text-white p-2" onClick={() => setMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden pointer-events-auto"
          >
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }} 
              className="absolute right-0 top-0 h-full w-[85%] max-w-[350px] bg-white dark:bg-zinc-950 p-10 flex flex-col"
            >
              <button className="self-end p-2 dark:text-white mb-8" onClick={() => setMenuOpen(false)}>
                <X size={32} />
              </button>
              
              <div className="space-y-6">
                {[...navLinks, {name: "Programs", href: "#programs"}].map((link, i) => (
                  <motion.div 
                    key={link.name} 
                    initial={{ x: 20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-4xl font-black italic tracking-tighter hover:text-red-600 cursor-pointer dark:text-white uppercase transition-colors"
                  >
                    {link.name}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Start Your Legacy</p>
                <button 
                  onClick={() => scrollToSection('#pricing')}
                  className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg tracking-tighter uppercase italic"
                >
                  Join EthioFit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;