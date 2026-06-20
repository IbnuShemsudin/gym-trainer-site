import React, { useState } from "react";
import { Trash2, Calendar, CreditCard } from "lucide-react";

export default function MembersTable({
  data = [], // 💡 FIXED: Matches the incoming 'data' prop sent by AdminDashboard
  onRefresh
}) {
  const [filter, setFilter] = useState("ALL");
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const safeMembers = Array.isArray(data) ? data : [];

  // 💡 FIXED: Implemented filter orchestration logic
  const filteredMembers = safeMembers.filter((member) => {
    if (filter === "ALL") return true;
    return member.status === filter;
  });

  const handleToggleMemberStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const nextStatus = currentStatus === "active" ? "suspended" : "active";
      
      const res = await fetch(`${BASE_API_URL}/api/admin/members/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok && onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to alter membership status authorization matrix:", err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to completely purge this member profile?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_API_URL}/api/admin/members/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok && onRefresh) onRefresh();
    } catch (err) {
      console.error("Purge operations exception caught:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* STATUS FILTER CONTROLS */}
      <div className="flex gap-2 bg-black/20 p-1.5 border border-white/5 rounded-2xl w-fit">
        {["ALL", "active", "suspended"].map((status) => {
          const isActive = filter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* CORE MEMBER TABLE WORKSPACE */}
      {filteredMembers.length === 0 ? (
        <div className="py-20 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl bg-black/10">
          No gym members found matching criteria
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/20">
          <table className="w-full min-w-[900px] text-sm text-left">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 bg-white/[0.01]">
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Member</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Plan</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Payment</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider">Status</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((member) => {
                const isMemberActive = member.status === "active";
                return (
                  <tr key={member._id} className="hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-bold">{member.name || "N/A"}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{member.email}</p>
                      </div>
                    </td>

                    <td className="p-4 text-zinc-300">
                      <div className="flex gap-2 items-center text-xs font-medium">
                        <Calendar size={14} className="text-zinc-500" />
                        <span className="bg-zinc-950 px-2 py-1 border border-white/5 rounded-lg text-zinc-300">
                          {member.tier || "Standard Tier"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2 items-center text-xs font-semibold text-emerald-400">
                        <CreditCard size={14} />
                        {Number(member.totalPaidETB || 0).toLocaleString()} ETB
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider ${
                          isMemberActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {member.status || "Unknown"}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleToggleMemberStatus(member._id, member.status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                          isMemberActive
                            ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                            : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {isMemberActive ? "Suspend Account" : "Activate Account"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMember(member._id)}
                        className="p-2 hover:bg-rose-500/10 rounded-xl group transition-all duration-150 inline-flex items-center align-middle"
                        title="Delete Member Profile"
                      >
                        <Trash2
                          size={16}
                          className="text-zinc-500 group-hover:text-rose-500 transition-colors"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}