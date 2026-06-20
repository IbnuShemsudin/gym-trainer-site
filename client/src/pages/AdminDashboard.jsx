import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// CORE COMPONENTS
import Sidebar from "../components/admin/Sidebar"; 
import Topbar from "../components/admin/Topbar";
import MobileMenu from "../components/admin/MobileMenu";
import OverviewPanel from "../components/admin/OverviewPanel";

// FEATURE PANELS
import LeadsTable from "../components/admin/LeadsTable";
import MembersTable from "../components/admin/MembersTable";
import RequestsPanel from "../components/admin/RequestsPanel";
import GalleryManager from "../components/admin/GalleryManager";
import PricingManager from "../components/admin/PricingManager";
import SettingsPanel from "../components/admin/SettingsPanel";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  // ---------------- STATE MANAGEMENT ----------------
  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [pricing, setPricing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("userName") || "Admin";

  // ---------------- SEAMLESS API FETCH WRAPPER ----------------
  const apiFetch = async (url, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && {
        Authorization: `Bearer ${token}`
      }),
    };

    const res = await fetch(url, { ...options, headers });

    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        data = await res.json();
      } catch (err) {
        console.error("JSON Parsing exception: ", err);
      }
    }

    return { res, data };
  };

  // ---------------- COMPREHENSIVE DATA SYNCHRONIZATION ----------------
  const fetchAllData = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsRefreshing(true);
    try {
      // 1. Fetch Captured Leads
      const { res: leadsRes, data: leadsData } = await apiFetch(`${BASE_API_URL}/api/leads`);
      if (leadsRes.ok) setLeads(leadsData?.data || []);

      // 2. Fetch Active Members
      const { res: memRes, data: memData } = await apiFetch(`${BASE_API_URL}/api/members`);
      if (memRes.ok) setMembers(memData?.data || []);

      // 3. Fetch Pending Admin Audits 
      const { res: reqRes, data: reqData } = await apiFetch(`${BASE_API_URL}/api/admin/requests`);
      
      // 💡 RE-SYNCHRONIZED: Explicitly pulls the target array from the object wrapper safely
      if (reqRes.ok) {
        if (reqData && Array.isArray(reqData.data)) {
          setRequests(reqData.data);
        } else if (Array.isArray(reqData)) {
          setRequests(reqData); // Fallback case if payload is flat
        } else {
          setRequests([]);
        }
      }

      // 4. Fetch User Gallery Media
      const { res: galRes, data: galData } = await apiFetch(`${BASE_API_URL}/api/gallery`);
      if (galRes.ok) setGallery(galData?.data || []);

      // 5. Fetch Pricing Structures
      const { res: priceRes, data: priceData } = await apiFetch(`${BASE_API_URL}/api/pricing`);
      if (priceRes.ok) setPricing(priceData?.data || []);

    } catch (err) {
      console.error("Critical telemetry dashboard crash caught: ", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ---------------- SAFE LEDGER METRICS CALCULATOR (CRASH-PROOFED) ----------------
  const estimatedRevenue =
    (Array.isArray(members) ? members : []).reduce((sum, item) => sum + (Number(item.totalPaidETB) || 0), 0) +
    (Array.isArray(requests) ? requests : []).reduce((sum, item) => sum + (Number(item.totalPaidETB) || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans tracking-wide">
        <RefreshCw className="animate-spin mr-3 text-emerald-400" size={20} />
        Syncing Secure Core Systems...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-white/5 bg-zinc-950/50">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          leads={leads}
          members={members}
          requests={requests}
        />
      </div>

      {/* MOBILE RESPONSIVE DRAWER OVERLAY */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        members={members}
        requests={requests}
      />

      {/* ACTION SYSTEM DISPLAY LAYOUT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          adminName={adminName}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* WORKSPACE GATEWAY PANEL ENGINE SWITCH */}
        <div className="p-6 flex-1 overflow-y-auto bg-gradient-to-b from-zinc-950 to-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "overview" && (
                <OverviewPanel
                  leads={leads}
                  members={members}
                  requests={requests}
                  estimatedRevenue={estimatedRevenue}
                />
              )}

              {activeTab === "leads" && (
                <LeadsTable data={leads} onRefresh={fetchAllData} />
              )}

              {activeTab === "members" && (
                <MembersTable data={members} onRefresh={fetchAllData} />
              )}

              {activeTab === "requests" && (
                <RequestsPanel data={requests} onRefresh={fetchAllData} />
              )}

              {activeTab === "gallery" && (
                <GalleryManager initialData={gallery} onRefresh={fetchAllData} />
              )}

              {activeTab === "pricing" && (
                <PricingManager initialData={pricing} onRefresh={fetchAllData} />
              )}

              {activeTab === "settings" && (
                <SettingsPanel />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SECURITY PORTAL CONTROL LAYER */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center bg-zinc-950 px-6">
          <span className="text-xs text-zinc-500 font-mono">System Integrity Protected</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-400 text-xs font-bold uppercase tracking-widest transition-colors duration-200"
          >
            <LogOut size={14} />
            Exit Admin Session
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;