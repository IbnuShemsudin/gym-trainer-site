import React from "react";
import {
  Users,
  UserCheck,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

export default function StatsCards({
  leads = [],      // 💡 Guarded fallback to prevent runtime crashes
  members = [],    // 💡 Guarded fallback to prevent runtime crashes
  requests = [],   // 💡 Guarded fallback to prevent runtime crashes
  revenue = 0,     // 💡 Guarded fallback to prevent runtime crashes
}) {
  // Normalize incoming props defensively
  const safeLeads = Array.isArray(leads) ? leads.length : 0;
  const safeMembers = Array.isArray(members) ? members.length : 0;
  const safeRequests = Array.isArray(requests) ? requests.length : 0;
  
  // Format the ETB currency output elegantly
  const formattedRevenue = typeof revenue === "number"
    ? revenue.toLocaleString("en-US")
    : Number(revenue || 0).toLocaleString("en-US");

  const cards = [
    {
      title: "Leads Captured",
      value: safeLeads,
      icon: Users,
      accent: "text-zinc-400",
    },
    {
      title: "Active Members",
      value: safeMembers,
      icon: UserCheck,
      accent: "text-emerald-500",
    },
    {
      title: "Pending Requests",
      value: safeRequests,
      icon: ShieldAlert,
      accent: safeRequests > 0 ? "text-red-500 animate-pulse" : "text-zinc-500",
    },
    {
      title: "Gross Revenue",
      value: `${formattedRevenue} ETB`,
      icon: TrendingUp,
      accent: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        // 💡 Assign to a capitalized variable name for clean JSX standard evaluation
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors duration-150"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                {card.title}
              </span>
              <Icon size={18} className={card.accent} />
            </div>

            <div>
              <h3 className="text-white text-xl md:text-2xl font-black tracking-tight">
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}