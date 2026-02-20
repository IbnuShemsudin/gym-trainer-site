import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Phone, Calendar, Trash2, LogOut, RefreshCw, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Leads with Auth Token
  const fetchLeads = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        headers: {
          "x-auth-token": token,
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        setLeads(data.data);
      } else {
        // If token is expired or invalid
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 2. Delete Lead Functionality
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this lead?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      if (res.ok) {
        setLeads(leads.filter((lead) => lead._id !== id));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 3. Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] p-4 md:p-12 pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* SMART HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Live Management Console</p>
            </div>
            <h2 className="text-5xl font-black dark:text-white uppercase italic tracking-tighter leading-none">
              Inbound <span className="text-red-600">Leads</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 px-6 py-3 rounded-2xl flex-1 md:flex-none">
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Database Volume</p>
              <p className="text-2xl font-black dark:text-white">{leads.length} <span className="text-xs text-zinc-500 font-medium tracking-normal">Profiles</span></p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-red-600 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* CONTROLS */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={fetchLeads} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} /> 
            Sync Database
          </button>
        </div>

        {/* SMART TABLE */}
        <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-3xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Prospect Profile</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Communication</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Goal</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Acquisition Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {leads.map((lead, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.03 }}
                      key={lead._id} 
                      className="border-b border-zinc-100 dark:border-white/5 hover:bg-red-600/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black italic shadow-lg shadow-red-600/20">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold dark:text-white text-zinc-900 text-lg">{lead.name}</span>
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">Verified Lead</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                            <Mail size={14} className="text-red-600/50"/> {lead.email}
                          </a>
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                              <Phone size={14} className="text-red-600/50"/> {lead.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-white/5">
                           <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                           <span className="text-[11px] font-black uppercase tracking-tight dark:text-zinc-200">
                            {lead.program}
                          </span>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                          <Calendar size={14} />
                          {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(lead._id)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {leads.length === 0 && !loading && (
            <div className="p-32 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                <Users size={32} className="text-white" />
              </div>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">
                The forge is empty. Awaiting new recruits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;