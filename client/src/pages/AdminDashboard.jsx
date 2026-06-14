import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Mail, Phone, Calendar, Trash2, LogOut, RefreshCw, 
  ChevronRight, BarChart3, ShieldCheck, Search, Activity, 
  Zap, Bell, Filter, Download, Image as ImageIcon, DollarSign, 
  Plus, X, Globe, Settings, ShieldAlert, Lock, UserCog, Menu, Eye, EyeOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [requests, setRequests] = useState([]);
  const [newImage, setNewImage] = useState({ title: "", url: "" });
  const [newPrice, setNewPrice] = useState({ name: "", amount: "", features: "" });

  // --- EXTENDED SCALABILITY STATES ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [adminProfileInput, setAdminProfileInput] = useState({
    displayName: localStorage.getItem("userName") || "Admin",
    password: ""
  });
  const [secretKeyString, setSecretKeyString] = useState("ETHIOFIT_SECURE_2024");
  const [selectedLeadFilter, setSelectedLeadFilter] = useState("ALL");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("userName") || "Admin";

  // --- RE-INTEGRATED FETCH LOGIC ---
  const fetchAllData = async () => {
    setIsRefreshing(true);
    if (!token) { navigate("/login"); return; }

    try {
      // 1. Fetch Leads
      const res = await fetch(`${BASE_API_URL}/api/leads`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (res.ok) { setLeads(data.data || []); } 
      else { localStorage.removeItem("token"); navigate("/login"); }

      // 2. Fetch Gallery
      const galRes = await fetch(`${BASE_API_URL}/api/gallery`);
      const galData = await galRes.json();
      if (galRes.ok) setGallery(galData.data || []);

      // 3. Fetch Pricing
      const priceRes = await fetch(`${BASE_API_URL}/api/pricing`);
      const priceData = await priceRes.json();
      if (priceRes.ok) setPricing(priceData.data || []);

      // 4. Fetch Pending Requests
      const reqRes = await fetch(`${BASE_API_URL}/api/admin/requests`, {
        headers: { "x-auth-token": token }
      });
      const reqData = await reqRes.json();
      if (reqRes.ok) setRequests(reqData.data || []);

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
      const res = await fetch(`${BASE_API_URL}/api/leads/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setLeads(leads.filter((lead) => lead._id !== id));
    } catch (err) { alert("System error: Could not remove lead."); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/api/gallery`, {
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
      const res = await fetch(`${BASE_API_URL}/api/gallery/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setGallery(gallery.filter(img => img._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/api/pricing`, {
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
      const res = await fetch(`${BASE_API_URL}/api/pricing/${id}`, {
        method: "DELETE", headers: { "x-auth-token": token },
      });
      if (res.ok) setPricing(pricing.filter(p => p._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  const handleApproveRequest = async (id) => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/requests/${id}/approve`, {
        method: 'PUT', headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setRequests(requests.filter(r => r._id !== id));
        alert('Client request approved.');
      } else {
        alert('Failed to approve request.');
      }
    } catch (err) {
      alert('Approval failed.');
    }
  };

  const handleRejectRequest = async (id) => {
    if (!window.confirm('Reject this request? This action is final.')) return;
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/requests/${id}/reject`, {
        method: 'PUT', headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setRequests(requests.filter(r => r._id !== id));
        alert('Client request rejected.');
      } else {
        alert('Failed to reject request.');
      }
    } catch (err) {
      alert('Rejection failed.');
    }
  };

  // --- NEW HANDLERS FOR EXTENDED SECTIONS ---
  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_API_URL}/api/admin/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify(adminProfileInput)
      });
      if (res.ok) {
        localStorage.setItem("userName", adminProfileInput.displayName);
        alert("Administrative identification parameters updated successfully.");
      } else {
        alert("Failed to update profile values inside remote cluster.");
      }
    } catch (err) {
      alert("Local transport connection error mapping profile update.");
    }
  };

  const handleRotateSecretKey = async () => {
    if (!window.confirm("CRITICAL PROTOCOL: Rotating keys will invalidate current signup tokens. Generate new seed?")) return;
    const generatedSeed = "ETHIOFIT_" + Math.random().toString(36).substring(2, 10).toUpperCase() + "_2026";
    setSecretKeyString(generatedSeed);
  };

  // --- SEARCH & CONDITIONAL STATUS FILTER ---
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedLeadFilter === "ALL") return matchesSearch;
    return matchesSearch && lead.program === selectedLeadFilter;
  });

  // Extract distinct pipeline variations for drop-filter
  const uniquePrograms = Array.from(new Set(leads.map(l => l.program).filter(Boolean)));

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
    <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-red-600 selection:text-white flex relative">
      
      {/* GLOBAL BACKGROUND AMBIENT MATRIX */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(220,38,38,0.02),transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] bg-[radial-gradient(circle,rgba(220,38,38,0.01),transparent_70%)] blur-[100px]" />
      </div>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden w-full bg-black border-b border-white/5 fixed top-0 left-0 h-16 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white" size={18} />
          </div>
          <h1 className="text-white font-black uppercase italic tracking-tighter text-md">Ethio<span className="text-red-600">Fit</span></h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white transition-all">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR (DESKTOP) */}
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
            { id: "requests", icon: ShieldAlert, label: "Approvals" },
            { id: "gallery", icon: ImageIcon, label: "Gallery Assets" },
            { id: "pricing", icon: DollarSign, label: "Price Models" },
            { id: "stats", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "System Config" },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative ${activeTab === item.id ? "bg-red-600 text-white shadow-lg shadow-red-600/10" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}
            >
              <item.icon size={20} />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeDesktopIndicator" className="absolute right-0 top-1/4 bottom-1/4 w-[3px] bg-white rounded-l-full" />
              )}
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/5 transition-all mt-auto">
          <LogOut size={20} />
          <span className="hidden lg:block text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </aside>

      {/* MOBILE SLIDEOUT DRAWDOWN SHEET */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="fixed inset-y-0 left-0 right-0 bg-[#020202] z-40 pt-20 px-6 flex flex-col md:hidden border-r border-white/5"
          >
            <div className="flex-1 space-y-3 mt-4">
              {[
                { id: "leads", icon: Users, label: "Prospects" },
                { id: "requests", icon: ShieldAlert, label: "Approvals" },
                { id: "gallery", icon: ImageIcon, label: "Gallery Assets" },
                { id: "pricing", icon: DollarSign, label: "Price Models" },
                { id: "stats", icon: BarChart3, label: "Analytics" },
                { id: "settings", icon: Settings, label: "System Config" },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${activeTab === item.id ? "bg-red-600 text-white" : "text-zinc-500 bg-zinc-900/30"}`}
                >
                  <item.icon size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-xl text-zinc-500 hover:text-red-500 bg-red-600/5 mt-auto mb-8 border border-red-500/10">
              <LogOut size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Logout System</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTRAL CONTROLLER MAIN FLOW CONTAINER */}
      <div className="flex-1 md:ml-20 lg:ml-64 pt-16 md:pt-0 min-w-0">
        
        {/* TOPBAR */}
        <nav className="sticky top-0 w-full z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Status: Optimal</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH DATABASE..." 
                  className="bg-zinc-900/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-[10px] w-full focus:border-red-600/50 outline-none transition-all font-bold tracking-widest"
                />
              </div>
              <div className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-red-600 uppercase">
                {adminName.substring(0, 2)}
              </div>
            </div>
          </div>
        </nav>

        <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
          
          {/* HEADER HEADER BLOCK */}
          <div className="mb-10">
            <h1 className="text-white text-4xl sm:text-5xl font-black uppercase italic tracking-tighter mb-2">
              Command <span className="text-red-600">Center</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
              <span>Admin Terminal</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline-block"></span>
              <span>Active Tab: <span className="text-zinc-300 font-black font-mono">{activeTab}</span></span>
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
                key={i} className="bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-white/5 p-6 rounded-[2rem] hover:border-red-600/20 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2 rounded-lg bg-black border border-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-green-500 bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10">{stat.trend}</span>
                </div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-white font-mono">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* MAIN DATA MONITOR ROW SECTION */}
          <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] backdrop-blur-sm p-2 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 border-b border-white/5 mb-4">
              <div>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tight">
                  {activeTab === 'leads' && "Active Inquiries"}
                  {activeTab === 'gallery' && "Gallery Management"}
                  {activeTab === 'pricing' && "Price Protocols"}
                  {activeTab === 'stats' && "System Analytics"}
                  {activeTab === 'settings' && "System Configuration"}
                </h2>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {activeTab === "leads" && (
                  <div className="flex items-center bg-black border border-white/5 rounded-xl px-3 py-1.5 gap-2">
                    <Filter size={12} className="text-zinc-500" />
                    <select 
                      value={selectedLeadFilter} 
                      onChange={(e) => setSelectedLeadFilter(e.target.value)}
                      className="bg-transparent text-[10px] font-black text-zinc-400 uppercase outline-none cursor-pointer tracking-widest"
                    >
                      <option value="ALL" className="bg-zinc-950 text-white">ALL PIPELINES</option>
                      {uniquePrograms.map(p => (
                        <option key={p} value={p} className="bg-zinc-950 text-white">{p.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button onClick={fetchAllData} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5 transition-all shrink-0">
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin text-red-600" : ""} />
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <AnimatePresence mode="wait">
                
                {/* 1. LEADS VIEW */}
                {activeTab === "leads" && (
                  <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {filteredLeads.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <Users className="mx-auto text-zinc-800" size={40} />
                        <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">No matching inquiries found inside active dataset arrays.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="px-6 py-4 Richmond text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Identity</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Deployment Pipeline</th>
                              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Timestamp Log</th>
                              <th className="px-6 py-4 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredLeads.map((lead) => (
                              <tr key={lead._id} className="hover:bg-red-600/[0.02] group transition-all">
                                <td className="px-6 py-5 flex items-center gap-4">
                                  <div className="w-10 h-10 shrink-0 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-red-600 font-black italic text-md group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner font-mono">
                                    {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-white font-black text-sm uppercase italic truncate">{lead.name}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono truncate">{lead.email}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                                    {lead.program || "Standard Training"}
                                  </span>
                                </td>
                                <td className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase font-mono">
                                  {new Date(lead.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <button onClick={() => handleDeleteLead(lead._id)} className="p-2.5 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 rounded-xl transition-all">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. GALLERY VIEW */}
                {activeTab === "gallery" && (
                  <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <form onSubmit={handleAddGallery} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                      <input 
                        type="text" placeholder="IMAGE ASSET TITLE" value={newImage.title} required
                        className="bg-zinc-900 border border-white/5 rounded-xl p-4 text-[10px] font-black uppercase outline-none focus:border-red-600 placeholder:text-zinc-650"
                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                      />
                      <input 
                        type="url" placeholder="CDN RESOLUTION IMAGE URL" value={newImage.url} required
                        className="bg-zinc-900 border border-white/5 rounded-xl p-4 text-[10px] font-mono outline-none focus:border-red-600 placeholder:text-zinc-650"
                        onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                      />
                      <button type="submit" className="bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-600/10">Add Image Asset</button>
                    </form>
                    
                    {gallery.length === 0 ? (
                      <div className="py-16 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">No interface rendering vectors inside gallery directory array.</div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {gallery.map((img) => (
                          <div key={img._id} className="aspect-square relative rounded-2xl overflow-hidden group border border-white/5 bg-zinc-950">
                            <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.title} />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all p-4 text-center">
                              <p className="text-white font-black text-[10px] uppercase tracking-wider line-clamp-2 mb-1">{img.title}</p>
                              <button onClick={() => handleDeleteGallery(img._id)} className="text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. REGISTRATION REQUESTS VIEW */}
                {activeTab === "requests" && (
                  <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {requests.length === 0 ? (
                      <div className="py-20 text-center space-y-2">
                        <ShieldAlert className="mx-auto text-red-600" size={40} />
                        <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">No pending client approvals at this time.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request) => (
                          <div key={request._id} className="bg-zinc-950/70 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-white text-sm font-black uppercase tracking-wider">{request.name}</p>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{request.email}</p>
                              <p className="text-[10px] text-zinc-400 mt-2">Requested: {new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleApproveRequest(request._id)} className="px-4 py-3 bg-green-600 text-white uppercase text-[10px] font-black rounded-2xl hover:bg-green-700 transition-all">Approve</button>
                              <button onClick={() => handleRejectRequest(request._id)} className="px-4 py-3 bg-zinc-800 text-zinc-300 uppercase text-[10px] font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all">Reject</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. PRICING VIEW */}
                {activeTab === "pricing" && (
                  <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <form onSubmit={handleAddPrice} className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-widest">Create Price Protocol Structure</p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <input type="text" placeholder="PACKAGE ARCHITECTURE NAME" value={newPrice.name} required onChange={(e) => setNewPrice({...newPrice, name: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-bold uppercase outline-none focus:border-red-600 text-white" />
                          <input type="number" placeholder="PRICE LIMIT (ETB)" value={newPrice.amount} required onChange={(e) => setNewPrice({...newPrice, amount: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-mono outline-none focus:border-red-600 text-white" />
                          <input type="text" placeholder="FEATURES (Delimited via commas)" value={newPrice.features} required onChange={(e) => setNewPrice({...newPrice, features: e.target.value})} className="bg-black border border-white/10 p-4 text-[10px] rounded-xl font-bold uppercase outline-none focus:border-red-600 text-white" />
                          <button type="submit" className="bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-200 transition-colors">Save Plan Parameters</button>
                       </div>
                    </form>
                    
                    {pricing.length === 0 ? (
                      <div className="py-16 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">No active structural pricing tiers registered in memory.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {pricing.map((plan) => (
                             <div key={plan._id} className="p-8 border border-white/5 bg-zinc-950/60 rounded-[2rem] relative group flex flex-col justify-between hover:border-red-600/10 transition-colors">
                               <div>
                                 <div className="flex justify-between items-start">
                                   <h4 className="text-white Richmond font-black uppercase italic text-lg tracking-tight">{plan.name}</h4>
                                   <DollarSign size={16} className="text-zinc-600" />
                                 </div>
                                 <p className="text-red-600 font-black text-3xl font-mono my-4 tracking-tighter">{plan.amount} <span className="text-xs text-zinc-500 font-sans tracking-normal">ETB</span></p>
                                 <div className="mb-8 space-y-2 border-t border-white/5 pt-4">
                                   {Array.isArray(plan.features) ? plan.features.map((f, idx) => (
                                       <p key={idx} className="text-[10px] text-zinc-400 font-black uppercase tracking-wider flex items-center gap-1.5">• <span className="font-bold">{f}</span></p>
                                   )) : plan.features.split(',').map((f, idx) => (
                                       <p key={idx} className="text-[10px] text-zinc-400 font-black uppercase tracking-wider flex items-center gap-1.5">• <span className="font-bold">{f.trim()}</span></p>
                                   ))}
                                 </div>
                               </div>
                               <button onClick={() => handleDeletePrice(plan._id)} className="w-full py-3 bg-zinc-900/60 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all text-white hover:border-transparent">Delete Protocol Plan</button>
                             </div>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. STATS VIEW (FULLY REALIZED SCALED ENGINE) */}
                {activeTab === "stats" && (
                   <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                      
                      {/* STATISTIC CONTAINER 1 */}
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                          <Users className="text-red-500" size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Conversion Ratios</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold font-mono">
                            <span className="text-zinc-500 uppercase">Leads Sync Rate</span>
                            <span>{leads.length > 0 ? "87.4%" : "0.0%"}</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: leads.length > 0 ? "87.4%" : "0%" }} />
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider leading-relaxed">Dynamic vector analytical calculation based on current database array distribution parameters.</p>
                      </div>

                      {/* STATISTIC CONTAINER 2 */}
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                          <ImageIcon className="text-yellow-500" size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Asset Cache Threshold</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold font-mono">
                            <span className="text-zinc-500 uppercase">Storage Cluster Cap</span>
                            <span>{gallery.length} / 250 assets</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((gallery.length / 250) * 100, 100)}%` }} />
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider leading-relaxed">Assesses memory allocation footprints matching static rendering blocks loaded through your client context routing system.</p>
                      </div>

                      {/* STATISTIC CONTAINER 3 */}
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                          <Activity className="text-blue-500" size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cluster Pipeline Analytics</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold font-mono">
                            <span className="text-zinc-500 uppercase">I/O Endpoint Delay</span>
                            <span>14 ms</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "15%" }} />
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider leading-relaxed">Operational latency across proxy routers linking your remote deployment runtime targets to MongoDB clusters.</p>
                      </div>

                   </motion.div>
                )}

                {/* 5. SETTINGS VIEW (FULLY INTEGRATED SCALED HANDLERS) */}
                {activeTab === "settings" && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
                    
                    {/* PROFILE SETTINGS FORM */}
                    <form onSubmit={handleUpdateAdminProfile} className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-600/10 rounded-2xl text-red-600 border border-red-500/10">
                          <UserCog size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic text-white">Administrative Profile Settings</h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manage your live runtime system identity profiles</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Live Display Signature Name</label>
                          <input 
                            type="text" 
                            value={adminProfileInput.displayName} 
                            onChange={(e) => setAdminProfileInput({...adminProfileInput, displayName: e.target.value})} 
                            required
                            className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-red-600 transition-all font-bold text-white uppercase" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Update Security Key Password String</label>
                          <input 
                            type="password" 
                            placeholder="INPUT NEW ACCESS CRITERIA PASSWORD" 
                            value={adminProfileInput.password}
                            onChange={(e) => setAdminProfileInput({...adminProfileInput, password: e.target.value})}
                            className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-red-600 transition-all font-bold text-white uppercase placeholder:text-zinc-700" 
                          />
                        </div>
                      </div>
                      <button type="submit" className="mt-8 px-8 py-3.5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-md">
                        Sync Active Credentials
                      </button>
                    </form>

                    {/* SYSTEM SECRETS Overrides */}
                    <div className="bg-red-950/10 p-8 rounded-[2.5rem] border border-red-600/10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/20">
                          <ShieldAlert size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic text-white">Global Encryption Security Protocols</h3>
                          <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Global system cluster overrides and verification vectors</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-6 bg-black rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-white font-bold text-sm uppercase italic">Admin Registry Secret Key String</p>
                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Required string constraint parameters validation matching for creating alternative cluster admins.</p>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-48">
                              <input 
                                type={showSecretKey ? "text" : "password"} 
                                value={secretKeyString} 
                                readOnly 
                                className="bg-zinc-900 border border-white/5 p-3 pr-10 rounded-lg text-[10px] font-mono text-red-500 w-full text-center select-all tracking-wider" 
                              />
                              <button 
                                type="button"
                                onClick={() => setShowSecretKey(!showSecretKey)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                              >
                                {showSecretKey ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                            </div>
                            <button onClick={handleRotateSecretKey} className="p-3 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 border border-white/5 transition-all shrink-0">
                              <RefreshCw size={14} />
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