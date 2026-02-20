import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldAlert, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        // Using window.location.href to ensure a clean state reload on the dashboard
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.message || "Invalid Authorization Credentials");
      }
    } catch (err) {
      setError("System Offline: Could not connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-zinc-900/50 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex p-3 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-600 mb-6"
            >
              <Lock size={28} />
            </motion.div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Admin <span className="text-red-600">Gate</span>
            </h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Secure Terminal Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Vector ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@ethiofit.com"
                  className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl text-white focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-800"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/5 p-4 pl-12 rounded-2xl text-white focus:border-red-600/50 outline-none transition-all placeholder:text-zinc-800"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                >
                  <ShieldAlert size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className="w-full group relative bg-red-600 disabled:bg-zinc-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 overflow-hidden transition-all hover:bg-red-700"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Establish Connection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Decor */}
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-[1px] w-8 bg-white/5" />
            <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Encrypted Session</span>
            <div className="h-[1px] w-8 bg-white/5" />
          </div>
        </div>
      </motion.div>

      {/* Aesthetic Side Text */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <p className="text-zinc-900 font-black text-6xl uppercase leading-none select-none">Auth_01</p>
      </div>
    </div>
  );
};

export default Login;