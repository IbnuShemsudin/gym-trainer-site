import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Award, Zap, Heart, Star, Dumbbell, Flower2, 
  ArrowUpRight, X, Quote, Calendar, ArrowRight, Loader2, 
  ShieldCheck, Instagram, Twitter, Target, CheckCircle2
} from "lucide-react";

const trainers = [
  {
    id: "aisha-01",
    name: "Aisha Mohammed",
    category: "strength",
    specialty: "Strength & Conditioning",
    image: "https://images.unsplash.com/photo-1594918731473-b3a61f5f24f0?q=80&w=1964&auto=format&fit=crop",
    bio: "Focused on high-performance metabolic conditioning and Olympic lifting protocols. Former national athlete.",
    available: "Mon, Wed, Fri",
    stats: [
      { icon: <Dumbbell size={14} />, value: "10+ Years Exp" },
      { icon: <Award size={14} />, value: "Certified CSCS" },
      { icon: <Target size={14} />, value: "Olympic Focus" },
    ],
  },
  {
    id: "samuel-02",
    name: "Samuel Kebede",
    category: "cardio",
    specialty: "HIIT & Cardio",
    image: "https://images.unsplash.com/photo-1547796903-8d266ec015c7?q=80&w=1974&auto=format&fit=crop",
    bio: "Specializes in endurance optimization and cardiovascular engine building. High-intensity specialist.",
    available: "Tue, Thu, Sat",
    stats: [
      { icon: <Zap size={14} />, value: "HIIT Master" },
      { icon: <Star size={14} />, value: "Marathoner" },
      { icon: <Heart size={14} />, value: "Cardiac Rehab" },
    ],
  },
  {
    id: "lema-03",
    name: "Lema Getachew",
    category: "mind",
    specialty: "Yoga & Mobility",
    image: "https://images.unsplash.com/photo-1601672322521-72993b8e4e97?q=80&w=1935&auto=format&fit=crop",
    bio: "Integrating ancient yoga techniques with modern biomechanics for peak recovery.",
    available: "Daily",
    stats: [
      { icon: <Flower2 size={14} />, value: "Yogi Expert" },
      { icon: <ShieldCheck size={14} />, value: "Mobility Lead" },
      { icon: <Heart size={14} />, value: "Recovery Pro" },
    ],
  },
];

const Trainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [bookingStatus, setBookingStatus] = useState("idle");

  const filteredTrainers = useMemo(() => {
    return activeFilter === "all" 
      ? trainers 
      : trainers.filter(t => t.category === activeFilter);
  }, [activeFilter]);

  const handleBooking = async () => {
    setBookingStatus("processing");
    setTimeout(() => setBookingStatus("confirmed"), 2000);
  };

  const closeModal = () => {
    setSelectedTrainer(null);
    setBookingStatus("idle");
  };

  return (
    <section className="py-32 px-6 bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter System */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-red-600" />
              <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px]">Division Leads</span>
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter leading-[0.85]">
              Elite <br /> <span className="text-red-600">Coaches</span>
            </h1>
          </div>

          {/* Logic-based Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5">
            {["all", "strength", "cardio", "mind"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === filter 
                    ? "bg-red-600 text-white shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredTrainers.map((trainer) => (
              <motion.div
                layout
                key={trainer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedTrainer(trainer)}
                className="group relative h-[600px] rounded-[3rem] overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-white/5 cursor-pointer shadow-2xl"
              >
                <img src={trainer.image} alt={trainer.name} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute top-8 left-8">
                    <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Available Today
                        </span>
                    </div>
                </div>

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-4xl font-black italic uppercase text-white leading-none mb-2">
                        {trainer.name.split(' ')[0]} <br/> 
                        <span className="text-red-600">{trainer.name.split(' ')[1]}</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-red-500 transition-colors">
                        {trainer.specialty}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-500">
                        <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* MODAL COMPONENT */}
      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(220,38,38,0.15)] max-h-[90vh] overflow-y-auto lg:overflow-visible"
            >
              <button onClick={closeModal} className="absolute top-8 right-8 z-50 p-4 rounded-full bg-black/50 text-white hover:bg-red-600 border border-white/10 transition-all">
                <X size={24} />
              </button>

              <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
                <img src={selectedTrainer.image} className="w-full h-full object-cover grayscale brightness-75" alt="" />
              </div>

              <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-[#0a0a0a]">
                <div className="mb-10">
                    <span className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Operator Profile</span>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white mb-4">
                    {selectedTrainer.name}
                    </h2>
                    <div className="flex gap-4">
                        <Instagram size={18} className="text-zinc-600 hover:text-red-600 cursor-pointer transition-colors" />
                        <Twitter size={18} className="text-zinc-600 hover:text-red-600 cursor-pointer transition-colors" />
                    </div>
                </div>
                
                <div className="space-y-8 mb-12 border-l-2 border-red-600/30 pl-8">
                  <div className="space-y-4">
                    <Quote className="text-red-600" size={28} />
                    <p className="text-zinc-400 text-lg italic leading-relaxed font-medium">"{selectedTrainer.bio}"</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTrainer.stats.map((s, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3 text-[11px] font-black text-white uppercase tracking-widest">
                        <span className="text-red-600">{s.icon}</span> {s.value}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Schedule: {selectedTrainer.available}</span>
                        <span>Next Slot: 08:00 AM</span>
                    </div>
                    <button 
                    onClick={handleBooking}
                    disabled={bookingStatus !== "idle"}
                    className={`group w-full py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-4 ${
                        bookingStatus === "confirmed" 
                        ? "bg-green-600 text-white" 
                        : "bg-red-600 text-white hover:bg-red-700 shadow-[0_20px_40px_rgba(220,38,38,0.2)]"
                    }`}
                    >
                    {bookingStatus === "processing" ? <Loader2 className="animate-spin" /> :
                    bookingStatus === "confirmed" ? <CheckCircle2 /> : <Calendar size={18} />}
                    
                    {bookingStatus === "processing" ? "Synchronizing..." : 
                    bookingStatus === "confirmed" ? "Protocol Confirmed" : "Initiate Booking Sequence"}
                    
                    {bookingStatus === "idle" && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Trainers;