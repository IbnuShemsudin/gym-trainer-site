import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Activity, Zap, 
  CreditCard, ChevronRight, 
  Plus, Bell, LogOut, ArrowUpRight,
  Target, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Operator";
  const userRole = localStorage.getItem("role") || "Client";

  const stats = [
    { label: "Active Streak", value: "12 Days", icon: <Zap className="text-orange-500" />, trend: "+2 today" },
    { label: "Avg intensity", value: "84%", icon: <Target className="text-red-500" />, trend: "Optimal" },
    { label: "Credits", value: "4 / 12", icon: <Award className="text-blue-500" />, trend: "Exp. in 14d" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-white pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-500">
                Verified {userRole} Access
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Welcome back, <br className="md:hidden" />
              <span className="text-red-600 drop-shadow-sm">{userName}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-red-600/50 transition-all relative group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-red-600 rounded-full border-2 border-white dark:border-black"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl shadow-black/10"
            >
              <LogOut size={16} /> Secure Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: STATUS & BIOMETRICS --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            {/* VIP CARD */}
            <div className="relative aspect-[1.6/1] bg-zinc-900 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border border-white/10 group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50"></div>
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000">
                <Zap size={240} strokeWidth={1} />
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-widest text-white">EthioFit Elite</h3>
                    <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase">Tier 01 Member</p>
                  </div>
                  <CreditCard className="text-white/20" size={28} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-1">Access Token</p>
                  <p className="text-xl font-mono tracking-[0.2em] text-white">**** **** 8842</p>
                </div>
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2">Performance Summary</h4>
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-black shadow-inner">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">
                    {stat.trend}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* --- RIGHT: ACTIONS & SCHEDULE --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-10"
          >
            {/* PRIMARY ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BOOKING BUTTON - LINKED TO SERVICES */}
              <div 
                onClick={() => navigate("/services")}
                className="group relative p-10 rounded-[3rem] bg-red-600 text-white shadow-2xl shadow-red-600/30 cursor-pointer overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <Plus size={40} className="group-hover:rotate-90 transition-transform duration-500" />
                    <ArrowUpRight size={24} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic leading-none mb-3">Book New <br/>Protocol</h3>
                  <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Access exclusive sessions</p>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-125 transition-transform duration-700">
                  <Calendar size={200} />
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 group cursor-pointer hover:border-red-600/50 transition-all hover:shadow-xl dark:hover:shadow-red-600/5">
                <Activity size={40} className="mb-10 text-red-600 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black uppercase italic leading-none mb-3">Analysis <br/>History</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">View body metrics</p>
              </div>
            </div>

            {/* UPCOMING SESSIONS */}
            <div className="bg-zinc-50 dark:bg-zinc-900/20 rounded-[3.5rem] p-10 border border-zinc-200 dark:border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h3 className="text-2xl font-black uppercase italic mb-1">Active Schedule</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Next 48 Hours</p>
                </div>
                <button className="px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-600 transition-all">
                  Full Calendar
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { title: "Heavy Bag HIIT", time: "08:00 AM", coach: "Coach Dawit", day: "14" },
                  { title: "Olympic Lifting", time: "05:30 PM", coach: "Coach Sarah", day: "15" }
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white dark:bg-black/40 border border-zinc-100 dark:border-white/5 group hover:border-red-600/40 transition-all cursor-default shadow-sm hover:shadow-xl">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-red-600 uppercase mb-1">Mar</p>
                        <p className="text-3xl font-black italic tracking-tighter">{session.day}</p>
                      </div>
                      <div className="h-12 w-[1px] bg-zinc-200 dark:bg-white/10"></div>
                      <div>
                        <p className="text-xl font-black uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
                          {session.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-1">
                          {session.time} • <span className="text-zinc-400 dark:text-zinc-600">{session.coach}</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;