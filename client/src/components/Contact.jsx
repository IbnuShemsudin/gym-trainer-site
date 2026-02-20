import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Mail, User, Target, AlertCircle, Phone } from "lucide-react";
import Toast from "./Toast"; // Ensure you created this file!

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(form.current);
    
    // Mapped to match your MongoDB Schema exactly
    const data = {
      name: formData.get("from_name"),
      email: formData.get("from_email"),
      phone: formData.get("from_phone"), // Now included to satisfy the backend
      program: formData.get("message"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setToastConfig({ 
          message: "Welcome to the Forge! We'll call you shortly.", 
          type: "success" 
        });
        setShowToast(true);
        form.current.reset();
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Backend Error:", error);
      setStatus("error");
      setToastConfig({ 
        message: "Validation Error: Please check your details.", 
        type: "error" 
      });
      setShowToast(true);
    }

    // Auto-hide toast
    setTimeout(() => setShowToast(false), 6000);
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <section id="contact" className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-red-600/30 bg-red-600/10">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">Join The Forge</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85]">
            Ready to <br /><span className="text-red-600">Transform?</span>
          </h2>
          <p className="mt-8 text-zinc-400 max-w-md text-lg font-medium leading-relaxed">
            Stop making excuses. Leave your details and our lead trainer will reach out to design your custom roadmap to power.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-red-600/50 transition-colors">
                <Mail size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Us</p>
                <p className="text-white font-bold tracking-tight">hello@thesweatbox.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Pro Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative bg-zinc-900/40 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-3xl">
            <form ref={form} onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  <User size={12} /> Full Name
                </label>
                <input 
                  type="text" name="from_name" required
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 focus:ring-1 ring-red-600 outline-none text-white transition-all placeholder:text-zinc-700"
                  placeholder="e.g. Elias Daniel"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    type="email" name="from_email" required
                    className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 focus:ring-1 ring-red-600 outline-none text-white transition-all placeholder:text-zinc-700"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input 
                    type="tel" name="from_phone" required
                    className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 focus:ring-1 ring-red-600 outline-none text-white transition-all placeholder:text-zinc-700"
                    placeholder="+251..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  <Target size={12} /> Your Primary Goal
                </label>
                <textarea 
                  name="message" required rows="2"
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 focus:ring-1 ring-red-600 outline-none text-white transition-all placeholder:text-zinc-700 resize-none"
                  placeholder="Hypertrophy, Endurance, Weight Loss..."
                ></textarea>
              </div>

              <motion.button 
                type="submit"
                disabled={status === "sending"}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all ${
                  status === "success" 
                  ? "bg-green-600" 
                  : status === "error"
                  ? "bg-zinc-800"
                  : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {status === "idle" && <><Send size={16}/> Claim Your Spot</>}
                {status === "sending" && "Connecting to Server..."}
                {status === "success" && <><CheckCircle size={16}/> Applied Successfully</>}
                {status === "error" && <><AlertCircle size={16}/> Form Incomplete</>}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification Mount Point */}
      <AnimatePresence>
        {showToast && (
          <Toast 
            message={toastConfig.message} 
            type={toastConfig.type} 
            onClose={() => setShowToast(false)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;