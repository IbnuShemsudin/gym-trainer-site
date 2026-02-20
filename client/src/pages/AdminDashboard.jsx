import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Mail, Phone, Calendar, Trash2, LogOut, RefreshCw, 
  ChevronRight, BarChart3, ShieldCheck, Search, Activity, 
  Zap, Bell, Filter, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    if (!window.confirm("CRITICAL ACTION: This will permanently purge the lead from EthioFit servers. Proceed?")) return;

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

  // Filter logic for search
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <RefreshCw className="text-red-600 animate-spin" size={48} />
        <div className="absolute inset-0 blur-xl bg-red-600/20 animate-pulse"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Authenticating Secure Connection...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 selection:text-white flex">
      
      {/* LEFT SIDEBAR - PRO UPGRADE */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black hidden md:flex flex-col items-center lg:items-start p-6 fixed h-full z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h1 className="hidden lg:block text-white font-black uppercase italic tracking-tighter text-xl">
            Ethio<span className="text-red-600">Fit</span>
          </h1>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[
            { icon: BarChart3, label: "Overview", active: true },
            { icon: Mail, label: "Prospects", active: false },
            { icon: Activity, label: "Workflows", active: false },
            { icon: Bell, label: "Alerts", active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-red-600 text-white shadow-lg shadow-red-600/10" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}>
              <item.icon size={20} />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all mt-auto">
          <LogOut size={20} />
          <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </aside>

      <div className="flex-1 md:ml-20 lg:ml-64">
        {/* TOPBAR */}
        <nav className="sticky top-0 w-full z-40 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Status: Optimal</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH DATABASE..." 
                  className="bg-zinc-900/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-[10px] w-64 focus:border-red-600/50 outline-none transition-all font-bold tracking-widest"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-black">AD</div>
            </div>
          </div>
        </nav>

        <div className="px-8 py-10 max-w-7xl mx-auto">
          {/* HEADER HEADER */}
          <div className="mb-10">
            <h1 className="text-white text-5xl font-black uppercase italic tracking-tighter mb-2">
              Command <span className="text-red-600">Center</span>
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
              <span>Admin: Yohannes T.</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Uptime: 142 Hours</span>
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Growth", value: leads.length, icon: Users, color: "text-red-600", trend: "+12%" },
              { label: "Conversion", value: "24%", icon: Zap, color: "text-yellow-500", trend: "+2.4%" },
              { label: "Network Load", value: "14ms", icon: Activity, color: "text-blue-500", trend: "Stable" },
              { label: "DB Integrity", value: "Verified", icon: ShieldCheck, color: "text-green-500", trend: "100%" },
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={i} className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-white/5 p-6 rounded-[2rem] hover:border-red-600/20 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2 rounded-lg bg-black border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-green-500">{stat.trend}</span>
                </div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* MAIN DATA SECTION */}
          <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] backdrop-blur-sm p-2 overflow-hidden">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <h2 className="text-white text-xl font-black uppercase italic tracking-tight">Active Inquiries</h2>
                <div className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black animate-pulse">LIVE</div>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchLeads} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 transition-all">
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin text-red-600" : ""} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 transition-all">
                  <Filter size={16} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 transition-all">
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Identity</th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Contact Vector</th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Deployment</th>
                    <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Timestamp</th>
                    <th className="px-8 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredLeads.map((lead) => (
                      <motion.tr 
                        key={lead._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="hover:bg-red-600/[0.03] group transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-600 font-black italic text-xl group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl">
                              {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                              <p className="text-white font-black text-sm uppercase italic tracking-wide group-hover:text-red-500 transition-colors">{lead.name || "UNIDENTIFIED"}</p>
                              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">SID: {lead._id.slice(-8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1 text-[11px] font-bold">
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                              <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center"><Mail size={10}/></div> 
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-all italic">
                                <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center"><Phone size={10}/></div>
                                {lead.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-300">
                              {lead.program || "Standard Training"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "---"}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleDelete(lead._id)} className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <div className="p-20 text-center">
                  <Users className="mx-auto text-zinc-800 mb-4" size={48} />
                  <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No prospects matching current parameters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;