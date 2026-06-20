import React from "react";
import { X } from "lucide-react";

// 💡 FIX: Ensure all properties live inside ONE opening and closing curly brace set
const MobileMenu = ({ 
  isOpen, 
  setIsOpen, 
  setActiveTab,
  activeTab,         
  leads = [],        
  members = [],      
  requests = [],     
}) => { // 💡 Arrow signature is placed precisely outside the final closing parenthesis block
  
  if (!isOpen) return null;

  const items = [
    { id: "overview", label: "Overview" },
    { id: "leads", label: "Leads" },
    { id: "members", label: "Members" },
    { id: "requests", label: "Requests" },
    { id: "gallery", label: "Gallery" },
    { id: "pricing", label: "Pricing" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#020202]/98 p-6 lg:hidden flex flex-col backdrop-blur-md">
      {/* MOBILE HEADER LAYER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white font-black uppercase tracking-widest text-xs text-zinc-500">
          Navigation Gateway
        </h2>

        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors"
        >
          <X className="text-white" size={20} />
        </button>
      </div>

      {/* LINKS INTERFACE ACTION CANVAS */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          
          let badgeCount = 0;
          if (item.id === "requests") badgeCount = requests?.length || 0;
          if (item.id === "leads") badgeCount = leads?.length || 0;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl font-bold transition-all duration-150 text-sm tracking-wide ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/10"
                  : "bg-zinc-900/50 text-zinc-400 border border-white/5 active:bg-zinc-900"
              }`}
            >
              <span>{item.label}</span>

              {/* DYNAMIC ALERT BADGES */}
              {badgeCount > 0 && (
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-tight ${
                  isActive 
                    ? "bg-white text-red-600" 
                    : "bg-red-500/20 text-red-400 border border-red-500/20"
                }`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileMenu;