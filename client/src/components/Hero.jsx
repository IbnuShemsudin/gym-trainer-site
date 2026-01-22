import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Users, Activity, ShieldCheck } from "lucide-react";

const Hero = () => {
  const { scrollY } = useScroll();
  // Parallax effect for the background image
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black pt-20">
      
      {/* BACKGROUND LAYER */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Gym Background"
          className="w-full h-full object-cover scale-110 opacity-60 dark:opacity-40 grayscale-[0.5] dark:grayscale-0"
        />
        {/* Advanced Gradient Masking */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/70 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-black" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT CONTENT — Occupies 7 columns */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="h-[2px] w-12 bg-red-600"></span>
            <span className="text-red-600 font-bold uppercase tracking-[0.4em] text-xs">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-red-600/40 hover:bg-red-700 transition-all"
            >
              Start Your Journey <ArrowRight size={20} />
            </motion.button>
            
            <button className="group flex items-center gap-4 text-zinc-900 dark:text-white font-bold uppercase tracking-widest">
              <span className="w-14 h-14 rounded-full border-2 border-zinc-200 dark:border-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
                <Play size={18} fill="currentColor" />
              </span>
              Watch Film
            </button>
          </div>

          {/* Social Proof / Mini Stats */}
          <div className="mt-16 flex items-center gap-8 border-t border-zinc-200 dark:border-white/10 pt-10">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-black bg-zinc-300 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="member" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-zinc-900 dark:text-white font-black text-xl leading-none">500+</p>
              <p className="text-zinc-500 text-xs uppercase font-bold tracking-tighter">Active Members</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD — Occupies 5 columns */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:block lg:col-span-5"
        >
          <div className="relative group">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-10 rounded-[2.5rem] shadow-3xl">
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-2xl font-black dark:text-white text-zinc-900 italic uppercase">Daily <br /> Schedule</h3>
                <div className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
                  LIVE UPDATES
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { time: "06:00", class: "Strength & Power", color: "bg-red-500", icon: <Activity size={16}/> },
                  { time: "10:00", class: "Yoga Flow", color: "bg-blue-500", icon: <ShieldCheck size={16}/> },
                  { time: "17:00", class: "Boxing HIIT", color: "bg-orange-500", icon: <Users size={16}/> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group/item cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} ring-4 ring-white dark:ring-zinc-800`}></div>
                      <div className="w-[1px] h-full bg-zinc-200 dark:bg-zinc-800 mt-2"></div>
                    </div>
                    <div className="pb-6">
                      <p className="text-zinc-400 font-bold text-xs mb-1">{item.time}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-zinc-900 dark:text-white font-black text-lg group-hover/item:text-red-600 transition-colors">{item.class}</p>
                        <span className="text-zinc-300 dark:text-zinc-700">{item.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-4 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-2xl text-zinc-400 font-bold text-xs uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all">
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