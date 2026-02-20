import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ICON SAFETY: Every icon used below is imported here
import { 
  Send, 
  Phone, 
  MapPin, 
  Instagram, 
  MessageCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowUpRight,
  ArrowRight, 
  Flame,      
  ShieldCheck,
  Zap
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phone: "",
    program: "Bodybuilding",
    message: "" 
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.loading) return;
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || "Invalid Data Sent");

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", phone: "", program: "Bodybuilding", message: "" });
      
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (err) {
      console.error("Submission Error:", err.message);
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  const socialLinks = [
    { icon: Phone, label: "Direct Line", value: "+251 963764285", href: "tel:+251963764285" },
    { icon: Instagram, label: "Aesthetics", value: "@haydi_ethio_aesthetics", href: "#" },
    { icon: MessageCircle, label: "Telegram", value: "t.me/H_Man", href: "#" },
    { icon: MapPin, label: "Base Ops", value: "SweatBox SarBet, AA", href: "#" },
  ];

  return (
    <section id="contact" className="py-32 bg-zinc-950 relative overflow-hidden">
      {/* Visual Decor: Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #3f3f46 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full" />

      <style>{`
        .stroke-red {
          -webkit-text-stroke: 1px #dc2626;
          color: transparent;
        }
        .custom-input:focus ~ label,
        .custom-input:not(:placeholder-shown) ~ label {
          transform: translateY(-20px) scale(0.8);
          color: #dc2626;
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* BRAND PANEL */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 mb-6">
                <Zap size={12} className="text-red-600 fill-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">System Online</span>
              </div>
              
              <h2 className="text-8xl md:text-[10rem] font-black text-white leading-[0.75] uppercase italic tracking-tighter mb-8">
                NO <br />
                <span className="stroke-red">LIMITS.</span>
              </h2>
              
              <p className="text-zinc-400 text-xl font-medium mb-16 max-w-sm border-l-4 border-red-600 pl-6">
                The elite training protocol for those who refuse to stay average.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {socialLinks.map((link, i) => (
                <motion.a 
                  key={i} 
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <p className="text-[10px] uppercase text-zinc-500 font-black tracking-[0.2em] mb-1 group-hover:text-red-500 transition-colors">{link.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm tracking-tight">{link.value}</span>
                    <ArrowUpRight size={14} className="text-red-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* FORM PANEL */}
          <div className="lg:col-span-7 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/40 border border-white/10 p-10 md:p-16 rounded-[2.5rem] backdrop-blur-xl relative"
            >
              <div className="absolute top-0 right-10 transform -translate-y-1/2">
                <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl shadow-red-600/20">
                  <Flame size={24} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="relative group">
                    <input 
                      name="name" required value={formData.name} onChange={handleChange} placeholder=" "
                      className="custom-input w-full bg-transparent border-b-2 border-zinc-800 py-3 text-white outline-none focus:border-red-600 transition-all font-bold text-lg" 
                    />
                    <label className="absolute left-0 top-3 text-zinc-600 uppercase font-black text-[10px] tracking-widest pointer-events-none transition-all">Full Name</label>
                  </div>

                  <div className="relative group">
                    <input 
                      name="phone" required value={formData.phone} onChange={handleChange} placeholder=" "
                      className="custom-input w-full bg-transparent border-b-2 border-zinc-800 py-3 text-white outline-none focus:border-red-600 transition-all font-bold text-lg" 
                    />
                    <label className="absolute left-0 top-3 text-zinc-600 uppercase font-black text-[10px] tracking-widest pointer-events-none transition-all">Mobile Comms</label>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    name="email" type="email" required value={formData.email} onChange={handleChange} placeholder=" "
                    className="custom-input w-full bg-transparent border-b-2 border-zinc-800 py-3 text-white outline-none focus:border-red-600 transition-all font-bold text-lg" 
                  />
                  <label className="absolute left-0 top-3 text-zinc-600 uppercase font-black text-[10px] tracking-widest pointer-events-none transition-all">Digital Address</label>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase text-red-600 font-black tracking-widest">Select Protocol</p>
                  <div className="flex flex-wrap gap-3">
                    {["Bodybuilding", "Weight Loss", "Strength"].map((p) => (
                      <button
                        key={p} type="button"
                        onClick={() => setFormData(prev => ({ ...prev, program: p }))}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                          formData.program === p 
                          ? "bg-red-600 border-red-600 text-white scale-105 shadow-lg shadow-red-600/20" 
                          : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <textarea 
                    name="message" required value={formData.message} onChange={handleChange} placeholder=" "
                    rows="2"
                    className="custom-input w-full bg-transparent border-b-2 border-zinc-800 py-3 text-white outline-none focus:border-red-600 transition-all font-bold text-lg resize-none" 
                  />
                  <label className="absolute left-0 top-3 text-zinc-600 uppercase font-black text-[10px] tracking-widest pointer-events-none transition-all">Mission Objectives</label>
                </div>

                <div className="pt-6">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status.loading}
                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 overflow-hidden relative
                      ${status.success ? 'bg-green-500 text-white' : 'bg-red-600 text-white shadow-2xl shadow-red-600/30'}`}
                  >
                    <AnimatePresence mode="wait">
                      {status.loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Loader2 className="animate-spin" />
                        </motion.div>
                      ) : status.success ? (
                        <motion.div key="success" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-2">
                          <CheckCircle2 /> <span>Data Received</span>
                        </motion.div>
                      ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <span>Initiate Access</span>
                          <ArrowRight size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  {status.error && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-red-500 text-[9px] mt-6 font-black uppercase text-center italic tracking-[0.2em] bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                    >
                      Alert: {status.error}
                    </motion.p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;