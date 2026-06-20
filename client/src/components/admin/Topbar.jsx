import React from "react";
import { Search, Menu } from "lucide-react";

const Topbar = ({
  searchQuery = "",        // 💡 Guarded fallback to ensure input stability
  setSearchQuery,
  adminName = "Admin",     // 💡 Default fallback string parameter
  onMenuToggle,            // 💡 Interactive callback to trigger MobileMenu drawer overlay
}) => {
  // Normalize letters gracefully to make high-end tech initials
  const adminInitials = adminName
    ? adminName.trim().substring(0, 2).toUpperCase()
    : "AD";

  return (
    <nav className="sticky top-0 z-30 bg-[#020202]/70 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
      
      {/* LEFT SECTION: RESPONSIBLE TOGGLES & METADATA OVERVIEW */}
      <div className="flex items-center gap-4">
        {/* HAMBURGER TRIGGER - ONLY VISIBLE ON MOBILE RESPONSIVE DRAWERS */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
          title="Open Control Gateway"
        >
          <Menu size={18} />
        </button>

        {/* ECOSYSTEM STATUS MARKER */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest hidden sm:inline-block">
            System Online
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: ACTIVE FILTER TEXT HUB & PROFILE IDENTIFIER */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search dashboard metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className="bg-zinc-900/50 border border-white/5 focus:border-red-600/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 outline-none w-40 sm:w-60 transition-all"
          />
        </div>

        {/* PREMIUM ACCOUNT INITIALS BADGE */}
        <div 
          className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white text-xs font-black tracking-wider shadow-lg shadow-red-600/10 select-none cursor-default shrink-0 border border-white/10"
          title={`Logged in as ${adminName}`}
        >
          {adminInitials}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;