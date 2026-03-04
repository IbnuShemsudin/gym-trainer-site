import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldAlert, Loader2, Fingerprint } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      
      if (res.ok && data.token) {
        // --- SECURE DATA STORAGE ---
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); 
        localStorage.setItem("userName", data.name || "Operator");

        // --- INTELLIGENT ROUTING ---
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // Standard users land on their Personal Dashboard
          navigate("/dashboard"); 
        }
      } else {
        setError(data.message || "Invalid Authorization Credentials");
      }
    } catch (err) {
      setError("System Offline: Server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.08),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative z-10 w-full max-w-[450px] px-6"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl">
          
          <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg text-white mb-6">
              <Fingerprint size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Identity <span className="text-red-600">Gate</span>
            </h2>
            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.5em] mt-3">Biometric Verification Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Vector ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                <input 
                  type="email" 
                  className="w-full bg-zinc-950/50 border border-white/5 p-4 pl-12 rounded-2xl text-white focus:border-red-600/50 outline-none transition-all text-sm"
                  placeholder="name@ethiofit.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                <input 
                  type="password" 
                  className="w-full bg-zinc-950/50 border border-white/5 p-4 pl-12 rounded-2xl text-white focus:border-red-600/50 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/5 p-4 rounded-2xl border border-red-500/10"
                >
                  <ShieldAlert size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={isLoading} 
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-red-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Establish Connection"}
            </button>
          </form>

          <p className="text-center mt-10 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            New Operator? <Link to="/register" className="text-white hover:text-red-600 ml-1 underline decoration-red-600/30">Request Access</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;