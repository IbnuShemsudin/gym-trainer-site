import React from "react";
import {
  Users,
  Image, // 💡 Fixed: Changed from ImageIcon to Image
  ShieldAlert,
  DollarSign,
  Settings,
  BarChart3,
  UserCheck,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  leads = [],      // 💡 Added to match Dashboard props pass
  members = [],    // 💡 Added to match Dashboard props pass
  requests = [],   // 💡 Defaulted to empty array defensively
  handleLogout,
}) {
  const menuItems = [
    {
      id: "overview",
      icon: BarChart3,
      label: "Overview",
    },
    {
      id: "leads",
      icon: Users,
      label: "Leads",
    },
    {
      id: "members",
      icon: UserCheck,
      label: "Members",
    },
    {
      id: "requests",
      icon: ShieldAlert,
      label: "Requests",
    },
    {
      id: "gallery",
      icon: Image, // 💡 Fixed reference
      label: "Gallery",
    },
    {
      id: "pricing",
      icon: DollarSign,
      label: "Pricing",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-black p-6 fixed h-full z-30">
      {/* BRANDING HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <ShieldCheck className="text-red-500" size={22} />
        <h1 className="text-white font-black tracking-wider text-lg">
          ETHIOFIT
        </h1>
      </div>

      {/* CORE NAVIGATION LINK ENGINE */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          // 🧠 Calculate conditional badges safely
          let badgeCount = 0;
          if (item.id === "requests") badgeCount = requests?.length || 0;
          if (item.id === "leads") badgeCount = leads?.length || 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group font-medium text-sm ${
                isActive
                  ? "bg-red-600 text-white font-semibold"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <IconComponent 
                size={18} 
                className={isActive ? "text-white" : "text-zinc-400 group-hover:text-white transition-colors"} 
              />
              <span>{item.label}</span>

              {/* DYNAMIC ALERT NOTIFICATION BADGES */}
              {badgeCount > 0 && (
                <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full tracking-tight ${
                  isActive 
                    ? "bg-white text-red-600" 
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER DISCONNECT PROTOCOL BUTTON */}
      <button
        onClick={handleLogout}
        className="absolute bottom-6 left-6 right-6 flex items-center gap-3 p-3 text-zinc-500 hover:text-red-500 rounded-xl hover:bg-red-500/5 transition-all duration-150 text-sm font-semibold"
      >
        <LogOut size={16} />
        Logout System
      </button>
    </aside>
  );
}