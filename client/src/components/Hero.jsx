import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Users, Activity, ShieldCheck } from "lucide-react";

const Hero = () => {
  const { scrollY } = useScroll();
  
  // FIXED PARALLAX: Moves from -50 to 50 to ensure no gaps at top/bottom
  const y1 = useTransform(scrollY, [0, 1000], [-50, 150]);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-black pt-20">
      
      {/* BACKGROUND LAYER - Optimized Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 h-[120%] -top-[10%]">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Gym Background"
            className="w-full h-full object-cover scale-110 opacity-40 dark:opacity-30 grayscale-[0.8] dark:grayscale-[0.5]"
          />
        </motion.div>
        
        {/* Superior Gradient Masking for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-zinc-50/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent dark:from-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="h-[2px] w-12 bg-red-600"></span>
            <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-[10px]">
              Elite Fitness Addis Ababa
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white leading-[0.9] mb-8 italic uppercase tracking-tighter">
            Forge Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
              Legacy
            </span>
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-medium">
            Join Ethiopia's most exclusive training community. We don't just change bodies; we redefine what you thought was possible.
          </p>

          <div className="flex flex-wrap gap-5">
            <motion.button 
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-red-600/40 hover:bg-red-700 transition-all"
            >
              Start Training <ArrowRight size={20} />
            </motion.button>
            
            <button className="group flex items-center gap-4 text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-sm">
              <span className="w-14 h-14 rounded-full border-2 border-zinc-200 dark:border-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                <Play size={18} fill="currentColor" />
              </span>
              Watch Film
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center gap-8 border-t border-zinc-200 dark:border-white/10 pt-10">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-zinc-50 dark:border-black bg-zinc-800 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="member" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-zinc-900 dark:text-white font-black text-2xl leading-none">500+</p>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Active Members</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD — Refined Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block lg:col-span-5"
        >
          <div className="relative">
            {/* Soft Glow */}
            <div className="absolute -inset-4 bg-red-600/10 rounded-[3rem] blur-3xl" />
            
            <div className="relative bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-2xl font-black dark:text-white text-zinc-900 italic uppercase leading-none">Daily <br /> Schedule</h3>
                <div className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse tracking-widest">
                  LIVE
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { time: "06:00", class: "Strength & Power", color: "bg-red-600", icon: <Activity size={16}/> },
                  { time: "10:00", class: "Yoga Flow", color: "bg-zinc-400", icon: <ShieldCheck size={16}/> },
                  { time: "17:00", class: "Boxing HIIT", color: "bg-red-600", icon: <Users size={16}/> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group/item cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} ring-4 ring-white dark:ring-zinc-900 group-hover/item:scale-125 transition-transform`}></div>
                      <div className="w-[1px] h-full bg-zinc-200 dark:bg-zinc-800 mt-2"></div>
                    </div>
                    <div className="pb-6">
                      <p className="text-zinc-400 font-bold text-[10px] uppercase mb-1 tracking-widest">{item.time}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-zinc-900 dark:text-white font-black text-lg group-hover/item:text-red-600 transition-colors uppercase italic">{item.class}</p>
                        <span className="text-zinc-300 dark:text-zinc-700 group-hover/item:text-red-600/50 transition-colors">{item.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-4 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:border-red-600 hover:text-red-600 transition-all">
                Full Calendar
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;