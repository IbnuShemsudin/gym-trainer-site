import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Key, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "" 
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        roleRequest: isAdminMode ? "admin" : "client"
      };

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login"); 
      } else {
        setError(data.message || "Registration Denied.");
      }
    } catch (err) {
      setError("System Failure: Gateway unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden selection:bg-red-600">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1),transparent_50%)]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-[450px] px-6">
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Account <span className="text-red-600">Init</span>
            </h2>
            
            {/* ROLE SELECTOR TOGGLE */}
            <div className="flex bg-black/50 p-1.5 rounded-2xl mt-6 border border-white/5 relative">
              <button 
                type="button"
                onClick={() => setIsAdminMode(false)}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl z-10 transition-all ${!isAdminMode ? 'text-white' : 'text-zinc-500'}`}
              >
                Client
              </button>
              <button 
                type="button"
                onClick={() => setIsAdminMode(true)}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl z-10 transition-all ${isAdminMode ? 'text-white' : 'text-zinc-500'}`}
              >
                Admin
              </button>
              <motion.div 
                animate={{ x: isAdminMode ? '100%' : '0%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-red-600 rounded-xl shadow-lg shadow-red-600/20"
              />
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                type="text" placeholder="Identity Name" required
                className="w-full bg-zinc-950/50 border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600/50 text-sm transition-all"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                type="email" placeholder="Vector ID (Email)" required
                className="w-full bg-zinc-950/50 border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600/50 text-sm transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <input 
                type="password" placeholder="Secure Access Key" required
                className="w-full bg-zinc-950/50 border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-red-600/50 text-sm transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {/* SECRET FIELD - ANIMATES IN ONLY FOR ADMINS */}
            <AnimatePresence>
              {isAdminMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600/50" size={16} />
                  <input 
                    type="password" placeholder="Admin Authorization Key" required
                    className="w-full bg-red-600/5 border border-red-600/20 p-4 pl-12 rounded-2xl text-red-500 outline-none focus:border-red-600 text-sm placeholder:text-red-900/50"
                    onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-red-500 text-[9px] font-black uppercase text-center bg-red-500/10 p-4 rounded-2xl border border-red-500/10">
                  <ShieldCheck className="inline-block mr-2 mb-0.5" size={12} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button disabled={isLoading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 active:scale-[0.98] transition-all shadow-xl shadow-red-600/20">
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Establish Credentials"}
            </button>
          </form>

          <p className="text-center mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            Already verified? <Link to="/login" className="text-white hover:text-red-600 ml-1 transition-colors underline decoration-red-600/30">Return to Gate</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;