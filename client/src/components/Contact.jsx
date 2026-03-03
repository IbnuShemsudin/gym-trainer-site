import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Send, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

const Contact = ({ initialPlan }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: initialPlan || "", 
    experience: "beginner",
  });

  // Sync program if the user changes their mind on the pricing page
  useEffect(() => {
    if (initialPlan) {
      setFormData((prev) => ({ ...prev, program: initialPlan }));
    }
  }, [initialPlan]);

  // --- VALIDATION LOGIC ---
  const validateStep = () => {
    setError(null);

    if (step === 1) {
      if (formData.name.trim().length < 3) {
        setError("Identification failed: Name must be at least 3 characters.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Protocol Error: Please enter a valid email address.");
        return false;
      }
    }

    if (step === 3) {
      // Ethiopian Phone Validation: Matches +251..., 09..., or 07... (10-13 digits total)
      const ethioPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;
      const cleanPhone = formData.phone.replace(/\s/g, "");
      if (!ethioPhoneRegex.test(cleanPhone)) {
        setError("Network Error: Provide a valid Ethiopian phone (+251... or 09...)");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Establishment Failed: Check data protocols.");
      }

      setIsSubmitting(false);
      setStep(4);
    } catch (err) {
      console.error("Submission Error:", err.message);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="flex gap-2 mb-12 justify-center">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= i ? 'bg-red-600' : 'bg-zinc-200 dark:bg-zinc-800'}`} 
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-4xl font-black uppercase italic dark:text-white mb-2">Who are <span className="text-red-600">you?</span></h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Step 01: Personal Identification</p>
              </header>

              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-5 pl-12 rounded-[1.5rem] outline-none focus:border-red-600 transition-all dark:text-white"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-5 pl-12 rounded-[1.5rem] outline-none focus:border-red-600 transition-all dark:text-white"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.email}
                className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 disabled:opacity-50 transition-all shadow-xl shadow-red-600/20"
              >
                Next Protocol <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: OBJECTIVE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-4xl font-black uppercase italic dark:text-white mb-2">Define <span className="text-red-600">Goal</span></h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Step 02: Strategic Objective</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Starter", "Pro", "Elite", "Bodybuilding", "Weight Loss", "Strength", "Performance"].map((prog) => (
                  <button
                    key={prog}
                    onClick={() => setFormData({...formData, program: prog})}
                    className={`p-5 rounded-[1.2rem] border text-left font-black uppercase italic text-sm transition-all ${formData.program === prog ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 dark:text-white hover:border-red-600/50'}`}
                  >
                    {prog}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="w-1/3 bg-zinc-200 dark:bg-zinc-800 dark:text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">Back</button>
                <button 
                  onClick={nextStep}
                  disabled={!formData.program}
                  className="w-2/3 bg-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 disabled:opacity-50"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUBMISSION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-4xl font-black uppercase italic dark:text-white mb-2">Final <span className="text-red-600">Auth</span></h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Step 03: Establish Connection</p>
              </header>

              <div className="bg-zinc-100 dark:bg-zinc-900/50 p-6 rounded-[1.5rem] border border-zinc-200 dark:border-white/5">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Application Summary</p>
                <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-3 mb-3">
                  <p className="text-xs text-zinc-500 font-bold uppercase">Candidate</p>
                  <p className="text-sm dark:text-white font-black uppercase italic">{formData.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500 font-bold uppercase">Selected Tier</p>
                  <p className="text-sm text-red-600 font-black uppercase italic">{formData.program}</p>
                </div>
              </div>

              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="tel" 
                  required
                  placeholder="+251 911 22 33 44"
                  value={formData.phone}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-5 pl-12 rounded-[1.5rem] outline-none focus:border-red-600 transition-all dark:text-white"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={prevStep} disabled={isSubmitting} className="w-1/3 bg-zinc-200 dark:bg-zinc-800 dark:text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest">Back</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.phone}
                  className="w-2/3 bg-red-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-red-600/40 transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Deploy Application</>}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex p-6 rounded-full bg-red-600/10 text-red-600 mb-4 ring-8 ring-red-600/5">
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-5xl font-black uppercase italic dark:text-white leading-none">Access <span className="text-red-600">Pending</span></h2>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                Application received. A Sweatbox strategist will reach out within 24 hours to schedule your induction.
              </p>
              <button 
                onClick={() => window.location.href = "/"}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 hover:text-white hover:bg-red-600 px-8 py-3 rounded-full transition-all border border-red-600/20"
              >
                Return to Base
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contact;