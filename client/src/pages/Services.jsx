import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, Users, Target, Trophy, 
  Heart, Flame, Shield, CheckCircle2, 
  ArrowRight, Crown, Star, Clock 
} from "lucide-react";

// Professional membership data
const tiers = [
  {
    name: "Foundation",
    price: "2,500",
    description: "Ideal for consistent trainers looking for a premium environment.",
    features: ["Access to all Gym Zones", "Locker & Shower Access", "2 Guest Passes/Month", "Basic Health Assessment"],
    highlight: false
  },
  {
    name: "Elite Performance",
    price: "4,500",
    description: "Our most popular tier for serious results and recovery.",
    features: ["Everything in Foundation", "Unlimited HIIT & Yoga Classes", "Monthly Body Composition Analysis", "1 Personal Training Session/Month", "Sauna & Cold Plunge Access"],
    highlight: true
  },
  {
    name: "Executive",
    price: "8,000",
    description: "The ultimate bespoke experience for high-performers.",
    features: ["Everything in Elite", "4 Dedicated PT Sessions/Month", "Personalized Nutrition Protocol", "Laundry Service for Kit", "Priority Workshop Booking"],
    highlight: false
  }
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-white pt-32 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-12 bg-red-600"></span>
            <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px]">The Ecosystem</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            Superior <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Capability</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl leading-relaxed font-medium border-l-2 border-red-600/20 pl-6">
            We don't provide "workouts." We provide an engineered environment of elite equipment, scientific recovery, and high-performance coaching.
          </p>
        </motion.div>
      </section>

      {/* 2. THE BENTO ECOSYSTEM GRID */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[220px]"
        >
          {/* Main Hero Tile */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 lg:row-span-2 bg-zinc-900 rounded-[2.5rem] p-10 relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <Zap className="text-red-600 mb-6" size={40} />
                <h3 className="text-4xl font-black uppercase italic mb-4 text-white leading-tight">Biomechanic <br/>Optimization</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">Our 1-on-1 coaching utilizes motion tracking and metabolic testing to eliminate plateaus.</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 group-hover:gap-4 transition-all">View Protocol <ArrowRight size={14}/></button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-red-600/10 blur-[80px] group-hover:bg-red-600/20 transition-all" />
          </motion.div>

          {/* Feature: Group Ops */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-white dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-zinc-200 dark:border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <Users className="text-red-600" size={32} />
              <div className="text-right">
                <span className="block text-[24px] font-black">24</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Classes / Week</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic">Elite Group Ops</h3>
              <p className="text-zinc-500 text-xs mt-1">High-stakes community training for peak mental toughness.</p>
            </div>
          </motion.div>

          {/* Feature: Recovery */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-zinc-100 dark:bg-zinc-900/40 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-white/5">
            <Shield className="text-red-600 mb-4" size={24} />
            <h3 className="font-black uppercase italic text-sm mb-2">Scientific Recovery</h3>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Sauna / Cold Plunge / Compression</p>
          </motion.div>

          {/* Feature: Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-1 bg-red-600 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center text-white">
            <Trophy size={28} className="mb-2" />
            <span className="text-xs font-black uppercase tracking-tighter leading-tight">National <br/> Champions</span>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. MEMBERSHIP TIERS */}
      <section className="bg-zinc-100 dark:bg-zinc-900/20 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4 italic">Membership <span className="text-red-600">Access</span></h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Select your level of commitment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-10 rounded-[3rem] border ${tier.highlight ? 'bg-zinc-900 border-red-600 shadow-2xl shadow-red-600/10' : 'bg-white dark:bg-black/40 border-zinc-200 dark:border-white/5'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest flex items-center gap-1">
                    <Crown size={10} /> RECOMMENDED
                  </div>
                )}
                
                <h3 className={`text-2xl font-black uppercase italic mb-2 ${tier.highlight ? 'text-white' : ''}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-red-600">{tier.price}</span>
                  <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">ETB / Mo</span>
                </div>
                
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{tier.description}</p>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-red-600 shrink-0" />
                      <span className={`text-xs font-bold uppercase tracking-wide ${tier.highlight ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${tier.highlight ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-red-600 hover:text-white'}`}>
                  Initiate Membership
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PERFORMANCE FAQ/PROMISE */}
      <section className="max-w-5xl mx-auto px-6 py-32 border-t border-zinc-200 dark:border-white/5">
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <h4 className="text-2xl font-black uppercase italic mb-6">The Sweatbox <br/> <span className="text-red-600">Standard</span></h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Clock className="text-red-600 shrink-0" size={24} />
                <div>
                  <p className="font-black uppercase italic text-sm">24/7 Priority Access</p>
                  <p className="text-zinc-500 text-xs mt-1">Executive members enjoy round-the-clock biometric entry.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Star className="text-red-600 shrink-0" size={24} />
                <div>
                  <p className="font-black uppercase italic text-sm">Pro-Grade Equipment</p>
                  <p className="text-zinc-500 text-xs mt-1">Sourced from the same manufacturers used by Olympic athletes.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-white/5">
            <p className="italic text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              "We built Sweatbox because Addis Ababa was missing a facility that matched the ambition of its high-performers. This isn't just a gym; it's an engineering lab for the human body."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=33" alt="Founder" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Founder & Lead Coach</p>
                <p className="text-red-600 text-xs font-bold">Dawit Tesfaye</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;