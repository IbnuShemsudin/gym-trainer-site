import React, { useState } from "react";
import { motion } from "framer-motion";

const Login = () => {
  // 1. Change 'username' to 'email' to match backend destructuring
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Debugging: Log exactly what you are sending
    console.log("Sending to backend:", formData);

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token); 
      window.location.href = "/admin/dashboard";
    } else {
      // Show the actual error message from the backend
      alert(data.message || "Access Denied.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleLogin}
        className="bg-zinc-900 p-10 rounded-[2rem] border border-white/10 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8">
          Admin <span className="text-red-600">Access</span>
        </h2>
        
        <input 
          type="text" 
          placeholder="Username"
          className="w-full bg-black border border-white/10 p-4 rounded-xl text-white mb-4 focus:border-red-600 outline-none transition-all"
          // 2. Update state key here to 'email'
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <input 
          type="password" 
          placeholder="Password"
          className="w-full bg-black border border-white/10 p-4 rounded-xl text-white mb-8 focus:border-red-600 outline-none transition-all"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <button className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-colors">
          Unlock Dashboard
        </button>
      </motion.form>
    </div>
  );
};

export default Login;