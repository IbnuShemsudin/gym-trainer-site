import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Phone, Calendar, Trash2, LogOut, RefreshCw, ChevronRight, BarChart3, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setIsRefreshing(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      
      if (res.ok) {
        setLeads(data.data || []);
      } else {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent Action: Remove this prospect from the database?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      if (res.ok) {
        setLeads(leads.filter((lead) => lead._id !== id));
      }
    } catch (err) {
      alert("System error: Could not remove lead.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <RefreshCw className="text-red-600 animate-spin" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-red-600 selection:text-white pb-20">
      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2 rounded-lg">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <h1 className="text-white font-black uppercase italic tracking-tighter text-xl">
              Ethio<span className="text-red-600">Fit</span> <span className="text-zinc-500 font-light not-italic text-sm ml-2">HQ</span>
            </h1>
          </div>
          <button onClick={handleLogout} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Terminate Session</span>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Growth", value: leads.length, icon: Users, color: "text-blue-500" },
            { label: "Active Campaigns", value: "Live", icon: BarChart3, color: "text-green-500" },
            { label: "Database Health", value: "99.9%", icon: ShieldCheck, color: "text-red-500" },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={stat.color} size={24} />
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-zinc-500 font-bold uppercase tracking-widest italic">System Active</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* MAIN DATA SECTION */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-white text-3xl font-black uppercase italic">Recent <span className="text-red-600">Inquiries</span></h2>
            <p className="text-zinc-500 text-sm">Real-time prospect acquisition data.</p>
          </div>
          <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} /> Sync
          </button>
        </div>

        <div className="bg-zinc-900/30 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Prospect</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Contact Info</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Selected Program</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date Received</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {leads.map((lead, idx) => (
                    <motion.tr 
                      key={lead._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] group transition-all"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black italic text-lg shadow-lg shadow-red-600/20">
                            {/* SAFE CHARAT CALL */}
                            {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p className="text-white font-bold leading-none mb-1">{lead.name || "Anonymous User"}</p>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">ID: {lead._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-sm">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-red-500 transition-colors"><Mail size={12}/> {lead.email}</a>
                          {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-all"><Phone size={12}/> {lead.phone}</a>}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-600/20">
                          {lead.program || "General Inquiry"}
                        </span>
                      </td>
                      <td className="p-6 text-xs text-zinc-500">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="p-6 text-right">
                        <button onClick={() => handleDelete(lead._id)} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;