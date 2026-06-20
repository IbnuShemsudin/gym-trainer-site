import React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, ShieldAlert, TrendingUp, Zap, Lock } from "lucide-react";

const OverviewPanel = ({
  leads = [],
  members = [],
  requests = [],
  estimatedRevenue = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Pipeline Expansion",
            value: leads.length,
            desc: "Total incoming dynamic lead forms",
            icon: Users,
            color: "text-red-500",
          },
          {
            label: "Validated Access Matrix",
            value: members.length,
            desc: "Approved permanent active users",
            icon: UserCheck,
            color: "text-green-500",
          },
          {
            label: "Pending Crypt Checks",
            value: requests.length,
            desc: "Receipt files waiting validation",
            icon: ShieldAlert,
            color: "text-orange-500",
          },
          {
            label: "Gross Ledger Ingested",
            value: `${estimatedRevenue} ETB`,
            desc: "Total cross-referenced revenue",
            icon: TrendingUp,
            color: "text-blue-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-white/5 p-6 rounded-[2rem] overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-black border border-white/5 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-[8px] font-mono text-zinc-600 uppercase">
                SYS_MTRX_{i + 1}
              </span>
            </div>

            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider mb-1">
              {stat.label}
            </p>

            <h3 className="text-2xl font-black text-white font-mono mb-2">
              {stat.value}
            </h3>

            <p className="text-[10px] text-zinc-600 leading-tight">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* LIVE SYSTEM PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH */}
        <div className="bg-black/40 border border-white/5 p-6 rounded-3xl lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-red-500 animate-pulse" />
              Live Request Execution Stream
            </h3>
            <span className="text-[9px] font-mono text-zinc-600">
              SYSTEM_TICK: 240Hz
            </span>
          </div>

          <div className="h-44 flex items-end gap-1.5 border-b border-white/5 pb-2">
            {[30, 45, 90, 65, 85, 110, 40, 75, 95, 120, 60, 80, 105, 70, 90].map(
              (v, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-zinc-900/60 rounded-t-md relative"
                  style={{ height: `${(v / 120) * 100}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-red-600 opacity-50 h-full rounded-t-md" />
                </div>
              )
            )}
          </div>

          <div className="flex justify-between text-[9px] font-mono text-zinc-600 mt-2">
            <span>INIT</span>
            <span>BUFFER</span>
            <span>UTC_2026</span>
          </div>
        </div>

        {/* SYSTEM LOAD */}
        <div className="bg-black/40 border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-white font-black text-xs uppercase tracking-widest">
              Network Cluster Loadouts
            </h3>

            {[
              { name: "Storage Grid", pct: "23%", color: "bg-zinc-500" },
              { name: "Memory Footprint", pct: "48%", color: "bg-red-500" },
              { name: "API Throughput", pct: "89%", color: "bg-green-500" },
            ].map((b, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-[9px] text-zinc-500 uppercase">
                  <span>{b.name}</span>
                  <span className="font-mono text-zinc-300">{b.pct}</span>
                </div>

                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color}`} style={{ width: b.pct }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-zinc-600 flex items-center gap-2">
            <Lock size={10} />
            Encrypted System Active
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewPanel;