import { motion } from "framer-motion";
import { Dumbbell, Zap, Target, Users, ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Strength & Power",
    desc: "Master the art of heavy lifting with our Olympic-grade equipment and expert coaching.",
    icon: <Dumbbell size={32} />,
    color: "from-red-600 to-orange-600",
  },
  {
    title: "HIIT & Burn",
    desc: "High-intensity metabolic conditioning designed to torch calories and boost endurance.",
    icon: <Zap size={32} />,
    color: "from-orange-600 to-yellow-500",
  },
  {
    title: "Yoga & Mobility",
    desc: "Improve flexibility, core strength, and mental clarity in our serene, light-filled studio.",
    icon: <Target size={32} />,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Personal Elite",
    desc: "One-on-one tailored programming with Ethiopia’s top-tier certified personal trainers.",
    icon: <Users size={32} />,
    color: "from-zinc-800 to-zinc-600",
  },
];

const Programs = () => {
  return (
    <section id="programs" className="py-24 px-6 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-red-600 font-bold uppercase tracking-[0.4em] text-sm mb-4"
            >
              Our Expertise
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter leading-[0.9]"
            >
              Push Your <span className="text-red-600">Limits</span>
            </motion.h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm border-l-2 border-red-600 pl-6">
            From beginners to pro athletes, our programs are engineered to deliver measurable results.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 group/container">
          {programs.map((prog, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer"
            >
              {/* Card Body */}
              <div className="h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 p-10 rounded-[2.5rem] transition-all duration-500 group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:shadow-red-600/10 group-focus-within/container:opacity-50 group-hover:!opacity-100">
                
                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prog.color} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  {prog.icon}
                </div>

                <h3 className="text-2xl font-black dark:text-white text-zinc-900 italic uppercase mb-4 tracking-tighter">
                  {prog.title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                  {prog.desc}
                </p>

                <div className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                  Learn More <ArrowRight size={14} />
                </div>
              </div>

              {/* Decorative Number background */}
              <span className="absolute -bottom-4 -right-2 text-8xl font-black text-zinc-200/20 dark:text-white/5 pointer-events-none italic">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;