import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, Users, Target, Trophy, 
  Shield, CheckCircle2, ArrowRight, 
  Crown, Star, Clock, Activity, 
  Dumbbell, Fingerprint, X, Upload, Check, AlertCircle
} from "lucide-react";

const tiers = [
  {
    name: "Foundation",
    price: 2500,
    description: "Ideal for consistent trainers looking for a premium environment.",
    features: ["Access to all Gym Zones", "Locker & Shower Access", "2 Guest Passes/Month", "Basic Health Assessment"],
    highlight: false
  },
  {
    name: "Elite Performance",
    price: 4500,
    description: "Our most popular tier for serious results and recovery.",
    features: ["Everything in Foundation", "Unlimited HIIT & Yoga Classes", "Monthly Body Composition Analysis", "1 Personal Training Session/Month", "Sauna & Cold Plunge Access"],
    highlight: true
  },
  {
    name: "Executive",
    price: 8000,
    description: "The ultimate bespoke experience for high-performers.",
    features: ["Everything in Elite", "4 Dedicated PT Sessions/Month", "Personalized Nutrition Protocol", "Laundry Service for Kit", "Priority Workshop Booking"],
    highlight: false
  }
];

const Services = () => {
  // Modal & Application Processing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(tiers[1]); 
  const [selectedProgram, setSelectedProgram] = useState("Bodybuilding");
  const [duration, setDuration] = useState(1); // 1, 3, or 12 Months

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Pricing multiplier matrix logic
  const getMultiplier = (months) => {
    if (months === 3) return 2.7; // 10% Off bundle discount
    if (months === 12) return 9.6; // 20% Off bundle discount
    return 1;
  };

  const calculateTotal = () => {
    return Math.round(selectedTier.price * getMultiplier(duration));
  };

  const openCheckout = (tierName) => {
    const targetTier = tiers.find(t => t.name === tierName) || tiers[1];
    setSelectedTier(targetTier);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      setScreenshotName(e.target.files[0].name);
    }
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !phone || !screenshot) return;

    // Package payload data structure ready for Node/Express API connectivity
    const applicationPayload = {
      name: clientName,
      phone: phone,
      tier: selectedTier.name,
      program: selectedProgram,
      durationMonths: duration,
      totalPaidETB: calculateTotal(),
      paymentProofFile: screenshot,
      status: "pending_approval"
    };

    console.log("Application Submitted Successfully to Gateway Node:", applicationPayload);
    setIsSubmitted(true);
  };

  const resetFormState = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setClientName("");
    setPhone("");
    setScreenshot(null);
    setScreenshotName("");
    setDuration(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-white pt-32 pb-20 selection:bg-red-600 selection:text-white relative">
      
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
              <button 
                onClick={() => { setSelectedProgram("Biometric Optimization"); openCheckout("Elite Performance"); }}
                className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-red-500 group-hover:text-red-400 transition-all text-left focus:outline-none"
              >
                Access Protocol <ArrowRight size={16}/>
              </button>
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
                  ? 'bg-zinc-950 border-red-600 shadow-[0_30px_60px_-15px_rgba(220,38,38,0.2)] scale-105 z-10 text-white' 
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
                  <span className="text-5xl font-black text-red-600 tracking-tighter">{tier.price.toLocaleString()}</span>
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

                <button 
                  onClick={() => openCheckout(tier.name)}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-[0.98] focus:outline-none ${
                    tier.highlight 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/30' 
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-red-600 hover:text-white'
                  }`}
                >
                  Establish Connection
                </button>
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

      {/* --- RECONSTRUCTED ADMISSIONS MODAL OVERLAY --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop Mask Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetFormState}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[998]"
            />

            {/* Core Modal Shell */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-x-4 top-8 bottom-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl h-[90vh] md:h-auto max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-10 z-[999] shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] block mb-1">Admissions Pipeline</span>
                  <h3 className="text-3xl font-black uppercase italic text-white">Join the Lab</h3>
                </div>
                <button 
                  onClick={resetFormState}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  
                  {/* Dynamic Selection Overview Indicators */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 mb-2">
                    <div>
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Access Tier</span>
                      <span className="text-sm font-black text-white uppercase italic">{selectedTier.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Base Rate</span>
                      <span className="text-sm font-black text-red-600">{selectedTier.price.toLocaleString()} ETB/Mo</span>
                    </div>
                  </div>

                  {/* Primary Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g., Abel Tesfaye"
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-600/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., 0911223344"
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-600/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Program Target Selection Layer */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-3">Target Discipline</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Bodybuilding", "Cardio / Burn", "Powerlifting", "HIIT Ops", "Athletic Mobility"].map((prog) => (
                        <button
                          type="button"
                          key={prog}
                          onClick={() => setSelectedProgram(prog)}
                          className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                            selectedProgram === prog 
                            ? "bg-red-600 border-red-600 text-white" 
                            : "bg-zinc-900 border-white/5 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          {prog}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operational Duration Pipeline Toggle */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400">Subscription Horizon</label>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Discounts Applied Suffix</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "1 Month", val: 1, desc: "Standard Cycle" },
                        { label: "3 Months", val: 3, desc: "10% Bundle Save" },
                        { label: "Annual", val: 12, desc: "20% Absolute Save" }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.val}
                          onClick={() => setDuration(item.val)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            duration === item.val
                            ? "bg-white text-black border-white"
                            : "bg-zinc-900 border-white/5 text-white hover:border-zinc-700"
                          }`}
                        >
                          <span className="block text-xs font-black uppercase tracking-tight">{item.label}</span>
                          <span className={`block text-[8px] font-bold uppercase mt-0.5 ${duration === item.val ? 'text-red-600' : 'text-zinc-500'}`}>{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Screen Transfer Upload Matrix */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">
                      Upload Bank Transfer Screenshot <span className="text-red-500">*</span>
                    </label>
                    <div className="relative border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-colors bg-zinc-900/20">
                      <input 
                        type="file" 
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="text-zinc-600 mb-2" size={24} />
                        {screenshotName ? (
                          <span className="text-xs font-bold text-red-500 uppercase tracking-tight max-w-[250px] truncate">{screenshotName}</span>
                        ) : (
                          <>
                            <span className="text-xs font-black uppercase tracking-wider text-white">Select Screenshot Image</span>
                            <span className="text-[9px] text-zinc-500 mt-1 font-medium">CBE, Awash, or Telebirr Receipt Interface</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Checkout Final Metrics Totalizer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Aggregated Total Due</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white tracking-tighter">{calculateTotal().toLocaleString()}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">ETB</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-lg shadow-red-600/10 transition-colors focus:outline-none"
                    >
                      Apply To Join Lab
                    </button>
                  </div>

                </form>
              ) : (
                /* Application Pending Success Screen UI */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-red-600/10 border border-red-600/30 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Check size={36} strokeWidth={3} />
                  </div>
                  <h4 className="text-2xl font-black uppercase italic text-white tracking-tight mb-3">Application Pipeline Locked</h4>
                  <p className="text-zinc-400 text-sm max-w-sm font-medium leading-relaxed mb-8">
                    Thanks <span className="text-white font-bold">{clientName}</span>. Your screenshot data payload has been logged. Admin operators will cross-reference the transaction ledger and activate entry via biometrics.
                  </p>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl mb-4">
                    <AlertCircle size={12} className="text-red-500" /> System Status: Pending Verification
                  </div>
                  <button
                    onClick={resetFormState}
                    className="mt-4 text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest border-b border-zinc-700 hover:border-white pb-0.5 transition-colors focus:outline-none"
                  >
                    Return To Lab Overview
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;