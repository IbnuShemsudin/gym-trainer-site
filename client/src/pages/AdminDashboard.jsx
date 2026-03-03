import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Mail, Phone, Calendar, Trash2, LogOut, RefreshCw, 
  ChevronRight, BarChart3, ShieldCheck, Search, Activity, 
  Zap, Bell, Filter, Download, Image as ImageIcon, DollarSign, 
  Plus, X, Globe, Settings, ShieldAlert, Lock, UserCog 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  // --- EXISTING STATES ---
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- NEW STATES (RETAINED & EXPANDED) ---
  const [activeTab, setActiveTab] = useState("leads");
  const [gallery, setGallery] = useState([]);
  const [pricing, setPricing] = useState([]); 
  const [newImage, setNewImage] = useState({ title: "", url: "" });
  const [newPrice, setNewPrice] = useState({ name: "", amount: "", features: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("userName") || "Admin";

  // --- RE-INTEGRATED FETCH LOGIC ---
  const fetchAllData = async () => {
    setIsRefreshing(true);
    if (!token) { navigate("/login"); return; }

    try {
      // 1. Fetch Leads
      const res = await fetch("http://localhost:5000/api/leads", {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (res.ok) { setLeads(data.data || []); } 
      else { localStorage.removeItem("token"); navigate("/login"); }

      // 2. Fetch Gallery
      const galRes = await fetch("http://localhost:5000/api/gallery");
      const galData = await galRes.json();
      if (galRes.ok) setGallery(galData.data || []);

      // 3. Fetch Pricing
      const priceRes = await fetch("http://localhost:5000/api/pricing");
      const priceData = await priceRes.json();
      if (priceRes.ok) setPricing(priceData.data || []);

    } catch (err) {
      console.error("System Fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // --- EXISTING HANDLERS ---
  const handleDeleteLead = async (id) => {
    if (!window.confirm("CRITICAL ACTION: This will permanently purge the lead. Proceed?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) { alert("System error: Could not remove lead."); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(newImage)
      });
      if (res.ok) { fetchAllData(); setNewImage({ title: "", url: "" }); }
    } catch (err) { alert("Upload failed"); }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Confirm deletion of gallery asset?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setGallery(gallery.filter(img => img._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(newPrice)
      });
      if (res.ok) { fetchAllData(); setNewPrice({ name: "", amount: "", features: "" }); }
    } catch (err) { alert("Pricing update failed"); }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm("Purge this price protocol?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/pricing/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setPricing(pricing.filter(p => p._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  // --- SEARCH FILTER ---
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
      
      {/* SIDEBAR */}
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
            { id: "leads", icon: Users, label: "Prospects" },
            { id: "gallery", icon: ImageIcon, label: "Gallery Assets" },
            { id: "pricing", icon: DollarSign, label: "Price Models" },
            { id: "stats", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "System Config" },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-lg shadow-red-600/10" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}
            >
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
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-red-600 uppercase">
                {adminName.substring(0, 2)}
              </div>
            </div>
          </div>
        </nav>

        <div className="px-8 py-10 max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-white text-5xl font-black uppercase italic tracking-tighter mb-2">
              Command <span className="text-red-600">Center</span>
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
              <span>Admin Terminal</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Active Tab: {activeTab}</span>
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Total Growth", value: leads.length, icon: Users, color: "text-red-600", trend: "+12%" },
              { label: "Gallery Assets", value: gallery.length, icon: ImageIcon, color: "text-yellow-500", trend: "Sync" },
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
                <h2 className="text-white text-xl font-black uppercase italic tracking-tight">
                  {activeTab === 'leads' && "Active Inquiries"}
                  {activeTab === 'gallery' && "Gallery Management"}
                  {activeTab === 'pricing' && "Price Protocols"}
                  {activeTab === 'stats' && "System Analytics"}
                  {activeTab === 'settings' && "System Configuration"}
                </h2>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchAllData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400">
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin text-red-600" : ""} />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                
                {/* 1. LEADS VIEW */}
                {activeTab === "leads" && (
                  <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Identity</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Deployment</th>
                            <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Timestamp</th>
                            <th className="px-8 py-4 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredLeads.map((lead) => (
                            <tr key={lead._id} className="hover:bg-red-600/[0.03] group transition-all">
                              <td className="px-8 py-6 flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-600 font-black italic text-xl group-hover:bg-red-600 group-hover:text-white transition-all">
                                  {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                  <p className="text-white font-black text-sm uppercase italic">{lead.name}</p>
                                  <p className="text-[9px] text-zinc-600">{lead.email}</p>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-300">
                                  {lead.program || "Standard Training"}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6 text-right">
                                <button onClick={() => handleDeleteLead(lead._id)} className="p-3 text-zinc-700 hover:text-red-500 transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* 2. GALLERY VIEW */}
                {activeTab === "gallery" && (
                  <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                      <input 
                        type="text" placeholder="IMG TITLE" value={newImage.title}
                        className="bg-zinc-900 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase outline-none focus:border-red-600"
                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="IMAGE URL" value={newImage.url}
                        className="bg-zinc-900 border border-white/5 rounded-xl p-4 text-[10px] font-black outline-none focus:border-red-600"
                        onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                      />
                      <button onClick={handleAddGallery} className="bg-red-600 text-white font-black uppercase text-[10px] rounded-xl hover:bg-red-700">Add Image</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {gallery.map((img) => (
                        <div key={img._id} className="aspect-square relative rounded-2xl overflow-hidden group border border-white/5">
                          <img src={img.url} className="w-full h-full object-cover" alt={img.title} />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                             <button onClick={() => handleDeleteGallery(img._id)} className="text-red-500"><Trash2 size={24}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 3. PRICING VIEW */}
                {activeTab === "pricing" && (
                  <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-widest">Create Price Protocol</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <input type="text" placeholder="PACKAGE NAME" value={newPrice.name} onChange={(e) => setNewPrice({...newPrice, name: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-bold uppercase" />
                          <input type="text" placeholder="PRICE (ETB)" value={newPrice.amount} onChange={(e) => setNewPrice({...newPrice, amount: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-bold uppercase" />
                          <input type="text" placeholder="FEATURES (Comma separated)" value={newPrice.features} onChange={(e) => setNewPrice({...newPrice, features: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-bold uppercase" />
                          <button onClick={handleAddPrice} className="bg-white text-black font-black uppercase text-[10px] rounded-xl">Save Plan</button>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {pricing.map((plan) => (
                           <div key={plan._id} className="p-8 border-2 border-red-600/20 bg-black rounded-[2rem] relative group">
                              <h4 className="text-white font-black uppercase italic text-xl">{plan.name}</h4>
                              <p className="text-red-600 font-black text-3xl my-4">{plan.amount} ETB</p>
                              <div className="mb-6 space-y-1">
                                {Array.isArray(plan.features) ? plan.features.map((f, idx) => (
                                    <p key={idx} className="text-[10px] text-zinc-500 font-bold uppercase">• {f}</p>
                                )) : <p className="text-[10px] text-zinc-500 font-bold uppercase">{plan.features}</p>}
                              </div>
                              <button onClick={() => handleDeletePrice(plan._id)} className="w-full py-3 bg-zinc-900 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all text-white">Delete Protocol</button>
                           </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* 4. STATS VIEW */}
                {activeTab === "stats" && (
                   <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center">
                      <BarChart3 className="mx-auto text-zinc-800 mb-4" size={64} />
                      <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Analytics Engine Offline - Data gathering in progress</p>
                   </motion.div>
                )}

                {/* 5. SETTINGS VIEW (NEW SECTION) */}
                {activeTab === "settings" && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
                    
                    {/* PROFILE SETTINGS */}
                    <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-600/10 rounded-2xl text-red-600">
                          <UserCog size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic text-white">Administrative Profile</h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manage your system identity</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Display Name</label>
                          <input type="text" defaultValue={adminName} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-red-600 transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Update Password</label>
                          <input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-red-600 transition-all font-bold" />
                        </div>
                      </div>
                      <button className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-zinc-200 transition-all">
                        Sync Credentials
                      </button>
                    </div>

                    {/* SYSTEM SECRETS */}
                    <div className="bg-red-950/10 p-8 rounded-[2.5rem] border border-red-600/10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-600 rounded-2xl text-white">
                          <ShieldAlert size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic text-white">Security Protocols</h3>
                          <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Global system overrides</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-black rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-white font-bold text-sm uppercase italic">Admin Secret Key</p>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Required for new admin registration</p>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="password" 
                              value="ETHIOFIT_SECURE_2024" 
                              readOnly 
                              className="bg-zinc-900 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-red-500 w-48 text-center" 
                            />
                            <button className="p-3 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all">
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;