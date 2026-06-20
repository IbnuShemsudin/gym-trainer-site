import React from "react";
import { Trash2 } from "lucide-react";

export default function LeadsTable({
  filteredLeads = [],          // 💡 Guarded fallback
  selectedLeadFilter = "ALL",  // 💡 Guarded fallback
  setSelectedLeadFilter,
  uniquePrograms = [],         // 💡 Guarded fallback
  handleDeleteLead,
}) {
  // Defensive validation arrays
  const safeLeads = Array.isArray(filteredLeads) ? filteredLeads : [];
  const safePrograms = Array.isArray(uniquePrograms) ? uniquePrograms : [];

  return (
    <div className="space-y-4">
      {/* FILTER PANEL BANNER BAR */}
      <div className="flex justify-between items-center bg-black/30 p-4 border border-white/5 rounded-2xl">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
          Filter Programs
        </span>

        <select
          value={selectedLeadFilter}
          onChange={(e) => setSelectedLeadFilter?.(e.target.value)}
          className="bg-zinc-900 text-white p-2 rounded-xl text-sm border border-white/5 focus:outline-none focus:border-red-600 transition-colors"
        >
          <option value="ALL">All Programs</option>
          {safePrograms.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      {/* RENDER RUNTIME WORKSPACE TARGET CONTAINER */}
      {safeLeads.length === 0 ? (
        <div className="py-20 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl bg-black/10">
          No leads found matching criteria
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/20">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 bg-white/[0.01]">
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Name</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Program</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Date</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {safeLeads.map((lead) => (
                <tr
                  key={lead._id || lead.id}
                  className="hover:bg-white/[0.02] transition-colors duration-150"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-bold">{lead.name || "N/A"}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{lead.email}</p>
                    </div>
                  </td>

                  <td className="p-4 text-zinc-300">
                    <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {lead.program || "General"}
                    </span>
                  </td>

                  <td className="p-4 text-zinc-400">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteLead?.(lead._id || lead.id)}
                      className="p-2 hover:bg-red-500/10 rounded-xl group transition-all duration-150"
                      title="Delete Entry"
                    >
                      <Trash2
                        size={16}
                        className="text-zinc-500 group-hover:text-red-500 transition-colors"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}