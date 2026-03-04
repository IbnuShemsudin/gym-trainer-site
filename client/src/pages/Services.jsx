import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, Users, Target, Trophy, 
  Shield, CheckCircle2, ArrowRight, 
  Crown, Star, Clock, Activity, 
  Dumbbell, Fingerprint
} from "lucide-react";

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
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-white pt-32 pb-20 selection:bg-red-600 selection:text-white">
      
      {/* --- HERO HEADER --- */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[2px] w-16 bg-red-600"></span>
            <span className="text-red-600 font-black uppercase tracking-[0.5em] text-[11px]">Professional Ecosystem</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8] mb-10">
            Engineered <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-zinc-400">Excellence.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl leading-relaxed font-medium max-w-2xl border-l-4 border-red-600 pl-8">
            We operate at the intersection of human potential and scientific precision. Your transformation is no longer a variable; it's a certainty.
          </p>
        </motion.div>
      </section>

      {/* --- BENTO ECOSYSTEM GRID --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[240px]"
        >
          {/* Main Hero Tile */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 lg:row-span-2 bg-zinc-900 rounded-[3rem] p-12 relative overflow-hidden group border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mb-8 shadow-lg shadow-red-600/20">
                  <Activity size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-4xl font-black uppercase italic mb-4 leading-tight">Biometric <br/>Optimization</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">1-on-1 coaching utilizing real-time metabolic tracking and motion analysis to eliminate plateaus.</p>
              </div>
              <Link to="/contact" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-red-500 group-hover:text-red-400 transition-all">
                Access Protocol <ArrowRight size={16}/>
              </Link>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-600/20 blur-[100px] group-hover:bg-red-600/30 transition-all duration-700" />
          </motion.div>

          {/* Feature: Group Ops */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3 bg-zinc-50 dark:bg-zinc-900/40 rounded-[3rem] p-10 border border-zinc-200 dark:border-white/5 flex flex-col justify-between hover:bg-white dark:hover:bg-zinc-800/50 transition-all">
            <div className="flex justify-between items-start">
              <Users className="text-red-600" size={40} strokeWidth={1.5} />
              <div className="text-right">
                <span className="block text-4xl font-black italic tracking-tighter text-red-600">24</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Classes / Wk</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Elite Group Ops</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-medium leading-snug">High-stakes community training environments for peak mental and physical toughness.</p>
            </div>
          </motion.div>

          {/* Feature: Recovery */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/40 rounded-[3rem] p-10 border border-zinc-200 dark:border-white/5 group hover:border-red-600/30 transition-all">
            <Shield className="text-red-600 mb-6" size={32} />
            <h3 className="font-black uppercase italic text-lg mb-3">Scientific Recovery</h3>
            <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em] space-y-2">
              <span className="block text-red-600">• IR Sauna</span>
              <span className="block">• Cryotherapy</span>
              <span className="block">• Compression</span>
            </p>
          </motion.div>

          {/* Feature: Stats */}
          <motion.div variants={itemVariants} className="lg:col-span-1 bg-red-600 rounded-[3rem] p-6 flex flex-col items-center justify-center text-center text-white shadow-xl shadow-red-600/20 group hover:scale-105 transition-transform">
            <Trophy size={40} className="mb-4" />
            <span className="text-[11px] font-black uppercase tracking-widest leading-tight">Tier-1 <br/> Facilities</span>
          </motion.div>
        </motion.div>
      </section>

      {/* --- MEMBERSHIP TIERS --- */}
      <section className="bg-zinc-100 dark:bg-zinc-900/30 py-32 border-y border-zinc-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black uppercase italic mb-6">Select <span className="text-red-600">Access</span></h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">Transparent Investment for Elite Results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`relative p-12 rounded-[3.5rem] border transition-all duration-500 ${
                  tier.highlight 
                  ? 'bg-zinc-950 border-red-600 shadow-[0_30px_60px_-15px_rgba(220,38,38,0.2)] scale-105 z-10' 
                  : 'bg-white dark:bg-black/40 border-zinc-200 dark:border-white/5 hover:border-red-600/50'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] font-black px-6 py-2 rounded-full tracking-[0.3em] flex items-center gap-2 shadow-lg">
                    <Crown size={12} /> RECOMMENDED
                  </div>
                )}
                
                <h3 className={`text-3xl font-black uppercase italic mb-4 ${tier.highlight ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                  {tier.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-red-600 tracking-tighter">{tier.price}</span>
                  <span className="text-zinc-500 text-[10px] font-black tracking-widest uppercase">ETB / Mo</span>
                </div>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-10 leading-relaxed font-medium">
                  {tier.description}
                </p>

                <div className="h-[1px] w-full bg-zinc-200 dark:bg-white/10 mb-10" />

                <ul className="space-y-5 mb-12">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 size={18} className="text-red-600 shrink-0 mt-0.5" />
                      <span className={`text-[11px] font-bold uppercase tracking-wider leading-tight ${tier.highlight ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <button className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-[0.98] ${
                    tier.highlight 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30' 
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-red-600 hover:text-white'
                  }`}>
                    Establish Connection
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- THE PROMISE / FOUNDER SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-red-600/20 rounded-[4rem] -rotate-3" />
            <div className="relative bg-zinc-100 dark:bg-zinc-900 p-12 md:p-16 rounded-[4rem] border border-zinc-200 dark:border-white/10 overflow-hidden">
               <Fingerprint className="absolute -right-10 -top-10 text-red-600/10 w-64 h-64" />
               <p className="relative z-10 italic text-2xl md:text-3xl text-zinc-600 dark:text-zinc-300 leading-[1.4] font-medium">
                "We built Sweatbox because Ethiopia was missing a facility that matched the ambition of its high-performers. This isn't just a gym; it's a <span className="text-zinc-900 dark:text-white font-black underline decoration-red-600 underline-offset-8">performance lab</span> for the human spirit."
              </p>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://i.pravatar.cc/150?u=dawit" alt="Dawit Tesfaye" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-1">Founder & Lead Coach</p>
                  <p className="text-xl font-black uppercase italic tracking-tight">Dawit Tesfaye</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-12">
            <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
              The Sweatbox <span className="text-red-600">Standard</span>
            </h4>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-black uppercase italic text-lg tracking-tight">24/7 Priority Access</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 font-medium max-w-sm">Executive members enjoy unrestricted biometric entry for total schedule flexibility.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 shrink-0">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <p className="font-black uppercase italic text-lg tracking-tight">Pro-Grade Arsenal</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 font-medium max-w-sm">Equipment sourced from manufacturers used in NFL and Olympic training centers.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600 shrink-0">
                  <Star size={24} />
                </div>
                <div>
                  <p className="font-black uppercase italic text-lg tracking-tight">The 1% Culture</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 font-medium max-w-sm">A strictly curated community of founders, athletes, and peak-performers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;