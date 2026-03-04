import { motion } from "framer-motion";
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Send, MapPin, Phone, Mail, Lock, 
  ArrowUpRight, LayoutDashboard 
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const token = localStorage.getItem("token"); // Check if user is logged in

  return (
    <footer className="relative bg-zinc-50 dark:bg-[#050505] pt-24 pb-12 overflow-hidden border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
      {/* Cinematic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column - wider span */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="group inline-flex items-center gap-2">
              <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg font-black italic text-xl shadow-lg shadow-red-600/20">E</span>
              <h1 className="text-3xl font-black tracking-tighter dark:text-white text-zinc-900 uppercase italic">
                ETHIO<span className="text-red-600 group-hover:text-red-500 transition-colors">FIT</span>
              </h1>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm max-w-sm">
              The ultimate high-performance destination in Addis Ababa. We forge elite athletes and stronger versions of you through science and grit.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 dark:text-white text-zinc-600 shadow-xl shadow-black/5 hover:border-red-600/50 transition-all"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation - span 2 */}
          <div className="lg:col-span-2">
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-[10px] mb-8 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-red-600" /> Navigation
            </h3>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {[
                { name: "Programs", path: "/programs" },
                { name: "Services", path: "/services" },
                { name: "The Lab", path: "/gallery" },
                { name: "About", path: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-red-600 transition-all flex items-center justify-between group">
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
              {/* Dynamic Dashboard Link */}
              {token && (
                <li>
                  <Link to="/dashboard" className="text-red-600 flex items-center gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-white/5">
                    <LayoutDashboard size={14} /> My Portal
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact - span 3 */}
          <div className="lg:col-span-3">
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-[10px] mb-8 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-red-600" /> HQ Location
            </h3>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4 text-zinc-600 dark:text-zinc-400">
                <MapPin className="text-red-600 shrink-0" size={20} />
                <span className="font-medium leading-tight">Bole Road, Mega House 4th Floor,<br/>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 group cursor-pointer hover:text-red-600 transition-colors">
                <Phone className="text-red-600 shrink-0" size={20} />
                <a href="tel:+251963764285" className="font-black italic">+251 963 76 42 85</a>
              </li>
              <li className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 group cursor-pointer hover:text-red-600 transition-colors">
                <Mail className="text-red-600 shrink-0" size={20} />
                <a href="mailto:train@ethiofit.com" className="font-black italic text-xs uppercase tracking-tighter">train@ethiofit.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter - span 3 */}
          <div className="lg:col-span-3">
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-[10px] mb-8 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-red-600" /> Intel
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs mb-6 font-medium">Join the roster for exclusive training protocols.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="OPERATOR EMAIL"
                className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 px-5 text-[10px] font-black tracking-widest focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all dark:text-white placeholder:text-zinc-500"
              />
              <button className="absolute right-2 top-2 p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 active:scale-90">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar - Redesigned */}
        <div className="pt-10 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              © {currentYear} ETHIOFIT PROTOCOLS
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <Link to="/privacy" className="hover:text-red-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-red-600 transition-colors">Terms</Link>
            
            {/* The Discreet Admin Access */}
            <Link 
              to="/login" 
              className="group flex items-center gap-2 text-zinc-300 dark:text-zinc-800 hover:text-red-600 dark:hover:text-red-900 transition-all duration-300"
            >
              <Lock size={12} className="group-hover:rotate-12 transition-transform" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">Staff Terminal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;