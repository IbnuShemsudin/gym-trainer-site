import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "Personal Training",
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

      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: "", email: "", phone: "", program: "Personal Training" });

      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message || "Network error" });
    }
  };

  return (
    <section id="contact" className="relative py-32 bg-zinc-950 flex items-center justify-center overflow-hidden">
      
      {/* MASSIVE BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[25vw] font-black text-white/[0.02] leading-none uppercase italic tracking-tighter">
          ELITE
        </h1>
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
        <div className="bg-black border-[3px] border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:flex-row">
          
          {/* LEFT: BRANDING PANEL */}
          <div className="lg:w-2/5 bg-zinc-900/50 backdrop-blur-xl p-12 lg:p-16 flex flex-col justify-between border-r-[3px] border-white/5">
            <div>
              <p className="text-red-600 font-black tracking-[0.5em] text-[14px] uppercase mb-8">
                Join the Forge
              </p>
              <h2 className="text-6xl md:text-7xl font-black text-white leading-[0.85] uppercase italic tracking-tighter mb-4">
                No <br />
                <span className="text-red-600">Limits.</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-4">
                Only Results.
              </p>
            </div>

            <div className="mt-20 space-y-12">
              <div>
                <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
                  HQ Location
                </h4>
                <p className="text-zinc-400 text-lg font-bold">
                  Addis Ababa, Ethiopia <br />
                  Elite Forge District
                </p>
              </div>

              <div>
                <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4 border-l-4 border-red-600 pl-4">
                  Direct Line
                </h4>
                <p className="text-zinc-400 text-lg font-bold">
                  training@ethiofit.com <br />
                  +251 900 000 000
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: THE FORM */}
          <div className="lg:w-3/5 p-12 lg:p-20">
            <form onSubmit={handleSubmit} className="space-y-14" noValidate>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                {/* NAME */}
                <div className="relative group">
                  <input
                    id="name" name="name" type="text" required
                    value={formData.name} onChange={handleChange}
                    className="w-full bg-transparent border-b-[3px] border-zinc-800 py-4 text-white text-2xl font-black outline-none focus:border-red-600 transition-all peer placeholder-transparent"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="absolute left-0 top-4 text-zinc-600 uppercase text-xs tracking-[0.3em] font-black pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-8">
                    Full Name
                  </label>
                </div>

                {/* PHONE */}
                <div className="relative group">
                  <input
                    id="phone" name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    className="w-full bg-transparent border-b-[3px] border-zinc-800 py-4 text-white text-2xl font-black outline-none focus:border-red-600 transition-all peer placeholder-transparent"
                    placeholder=" "
                  />
                  <label htmlFor="phone" className="absolute left-0 top-4 text-zinc-600 uppercase text-xs tracking-[0.3em] font-black pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-8">
                    Phone Number
                  </label>
                </div>
              </div>

              {/* EMAIL */}
              <div className="relative group">
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-transparent border-b-[3px] border-zinc-800 py-4 text-white text-2xl font-black outline-none focus:border-red-600 transition-all peer placeholder-transparent"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute left-0 top-4 text-zinc-600 uppercase text-xs tracking-[0.3em] font-black pointer-events-none transition-all peer-focus:-top-8 peer-focus:text-red-600 peer-[:not(:placeholder-shown)]:-top-8">
                  Email Address
                </label>
              </div>

              {/* PROGRAM SELECT */}
              <div className="space-y-8">
                <label className="block text-zinc-400 uppercase text-xs tracking-[0.3em] font-black">
                  Select Your Protocol
                </label>

                <div className="flex flex-wrap gap-4">
                  {["Personal Training", "Group Classes", "Bodybuilding", "Weight Loss"].map((p) => (
                    <button
                      key={p} type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, program: p }))}
                      className={`px-10 py-4 rounded-2xl border-[3px] text-[13px] font-black uppercase tracking-widest transition-all ${
                        formData.program === p
                          ? "bg-red-600 text-white border-red-600 shadow-[0_10px_30px_rgba(220,38,38,0.5)] scale-105"
                          : "bg-transparent text-zinc-600 border-zinc-800 hover:border-zinc-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <div className="pt-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status.loading}
                  type="submit"
                  className="w-full group relative bg-red-600 py-8 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.3)] disabled:opacity-50 transition-all"
                >
                  {/* Subtle hover sweep effect */}
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  
                  <div className="flex items-center justify-center gap-6">
                    <span className="text-white uppercase text-xl font-black tracking-[0.4em]">
                      {status.loading ? "Processing" : status.success ? "Verified" : "Start Protocol"}
                    </span>
                    {status.loading ? (
                      <Loader2 size={28} className="animate-spin text-white" />
                    ) : status.success ? (
                      <Check size={28} className="text-white" />
                    ) : (
                      <ArrowRight size={28} className="text-white group-hover:translate-x-3 transition-transform" />
                    )}
                  </div>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;