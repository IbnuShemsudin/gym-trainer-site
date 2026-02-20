import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin, Phone, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for internal routing

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-50 dark:bg-black pt-20 pb-10 overflow-hidden border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="group flex items-center gap-1">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded font-black italic">S</span>
              <h1 className="text-2xl font-black tracking-tighter dark:text-white text-zinc-900 uppercase italic">
                Sweat<span className="text-red-600 group-hover:text-red-500 transition-colors">box</span>
              </h1>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
              The premier fitness destination in Ethiopia. We blend world-class equipment with elite coaching to help you forge your strongest self.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: "#dc2626" }}
                  className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 dark:text-white text-zinc-600 shadow-sm"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-sm mb-6 underline decoration-red-600 decoration-2 underline-offset-8">Navigation</h3>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {[
                { name: "Home", path: "/" },
                { name: "Programs", path: "/programs" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-[2px] bg-red-600 transition-all group-hover:w-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-sm mb-6 underline decoration-red-600 decoration-2 underline-offset-8">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                <MapPin className="text-red-600 shrink-0" size={18} />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors">
                <Phone className="text-red-600 shrink-0" size={18} />
                <a href="tel:+251911000000">+251 911 000 000</a>
              </li>
              <li className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors">
                <Mail className="text-red-600 shrink-0" size={18} />
                <a href="mailto:train@sweatbox.com">train@sweatbox.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-black uppercase italic tracking-widest text-sm mb-6 underline decoration-red-600 decoration-2 underline-offset-8">Newsletter</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Get training tips and class updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Your email"
                className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-600 transition-colors dark:text-white"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
          <p>© {currentYear} ETHIOFIT. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-red-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms</a>
            
            {/* THE SECRET ADMIN LINK */}
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-900 hover:text-red-600 dark:hover:text-red-900 transition-all duration-500"
              title="Staff Only"
            >
              <Lock size={10} />
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;