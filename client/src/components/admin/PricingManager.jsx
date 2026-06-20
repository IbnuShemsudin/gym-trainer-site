import React, { useState } from "react";
import { Trash2, Plus, CheckCircle2 } from "lucide-react";

export default function PricingManager({
  initialData = [], // 💡 Maps perfectly to initialData from AdminDashboard
  onRefresh,        // 💡 Hook to pull clean updates from backend database
}) {
  const baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const safePlans = Array.isArray(initialData) ? initialData : [];

  // 🧠 Keep form state local for ultra-responsive input performance
  const [newPrice, setNewPrice] = useState({
    name: "",
    amount: "",
    features: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚀 Form submit network request processing pipeline
  const handleAddPrice = async (e) => {
    e.preventDefault();
    if (!newPrice.name || !newPrice.amount) return alert("Plan Name and Price are required.");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      // Convert raw string features to clean structured arrays for database compliance
      const formattedFeatures = typeof newPrice.features === "string" 
        ? newPrice.features.split(",").map(f => f.trim()).filter(Boolean)
        : [];

      const res = await fetch(`${baseApiUrl}/api/pricing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
        body: JSON.stringify({
          name: newPrice.name,
          amount: Number(newPrice.amount),
          features: formattedFeatures,
        }),
      });

      if (res.ok) {
        setNewPrice({ name: "", amount: "", features: "" });
        onRefresh?.(); // Refetch database numbers
      }
    } catch (err) {
      console.error("Pricing add payload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Delete pricing tier controller
  const handleDeletePrice = async (id) => {
    if (!window.confirm("Are you sure you want to drop this tier plan?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseApiUrl}/api/pricing/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });
      if (res.ok) onRefresh?.();
    } catch (err) {
      console.error("Pricing delete sequence failure:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. PLAN GENERATION PANEL FORM */}
      <form
        onSubmit={handleAddPrice}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/20 p-5 border border-white/5 rounded-2xl"
      >
        <input
          placeholder="Plan Name (e.g. Pro Elite)"
          value={newPrice.name}
          onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })}
          className="bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
          required
        />

        <input
          type="number"
          placeholder="Price (ETB)"
          value={newPrice.amount}
          onChange={(e) => setNewPrice({ ...newPrice, amount: e.target.value })}
          className="bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
          required
        />

        <input
          placeholder="Features (comma separated)"
          value={newPrice.features}
          onChange={(e) => setNewPrice({ ...newPrice, features: e.target.value })}
          className="bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 h-full py-3 md:py-0 transition-colors duration-150"
        >
          <Plus size={16} />
          {isSubmitting ? "Processing..." : "Add Plan"}
        </button>
      </form>

      {/* 2. LIVE DISPLAY SUBSCRIPTION TIERS CARDS GRID */}
      {safePlans.length === 0 ? (
        <div className="py-20 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl bg-black/10">
          No premium pricing plans deployed yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safePlans.map((plan) => {
            const parsedFeatures = Array.isArray(plan.features)
              ? plan.features
              : typeof plan.features === "string"
              ? plan.features.split(",").map((f) => f.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={plan._id || plan.id}
                className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all duration-200 relative group"
              >
                <div>
                  {/* CARD CARD TOP BAR BANNER HEADER */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-black tracking-wide text-zinc-400 text-sm uppercase">
                      {plan.name}
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleDeletePrice(plan._id || plan.id)}
                      className="p-2 hover:bg-red-500/10 rounded-xl transition-all opacity-40 group-hover:opacity-100"
                      title="Purge Plan Tier"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  {/* PRICING NUMERIC BLOCK */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <h2 className="text-3xl font-black text-white tracking-tight">
                      {Number(plan.amount).toLocaleString()}
                    </h2>
                    <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">
                      ETB / month
                    </span>
                  </div>

                  {/* PARSED FEATURES DYNAMIC SCROLL CONTAINER */}
                  <ul className="mt-6 space-y-3 border-t border-white/5 pt-5">
                    {parsedFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}