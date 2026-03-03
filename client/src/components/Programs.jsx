import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Dumbbell, Zap, Target, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <button onClick={onClick} className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
        {children}
      </button>
    </motion.div>
  );
};

// --- TILT WRAPPER ---
const TiltCard = ({ children }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
};

const Programs = () => {
  const navigate = useNavigate();

  return (
    <section id="programs" className="py-24 px-6 bg-white dark:bg-black transition-colors duration-500 overflow-hidden perspective-1000">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-red-600 font-bold uppercase tracking-[0.4em] text-sm mb-4">Our Expertise</h2>
            <h1 className="text-5xl md:text-7xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter leading-[0.9]">
              Push Your <span className="text-red-600">Limits</span>
            </h1>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm border-l-2 border-red-600 pl-6">
            From beginners to pro athletes, our programs are engineered to deliver measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog, i) => (
            <TiltCard key={i}>
              <div 
                style={{ transformStyle: "preserve-3d" }}
                className="h-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 p-10 rounded-[2.5rem] transition-all duration-500 group-hover:bg-white dark:group-hover:bg-zinc-800"
              >
                <div style={{ transform: "translateZ(50px)" }} className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${prog.color} flex items-center justify-center text-white mb-8 shadow-lg`}>
                  {prog.icon}
                </div>

                <h3 style={{ transform: "translateZ(30px)" }} className="text-2xl font-black dark:text-white text-zinc-900 italic uppercase mb-4 tracking-tighter">
                  {prog.title}
                </h3>
                
                <p style={{ transform: "translateZ(20px)" }} className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
                  {prog.desc}
                </p>

                {/* Magnetic CTA with Navigation */}
                <div style={{ transform: "translateZ(40px)" }}>
                  <MagneticButton 
                        onClick={() => navigate("/services")}
                        data-cursor="GO"
                      >
                        Learn More <ArrowRight size={14} />
                  </MagneticButton>
                </div>

                <span style={{ transform: "translateZ(-20px)" }} className="absolute -bottom-4 -right-2 text-8xl font-black text-zinc-200/20 dark:text-white/5 pointer-events-none italic">
                  0{i + 1}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;