import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Pass setSelectedPlan (from App.jsx) as a prop
const Pricing = ({ setSelectedPlan }) => { 
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pricing");
        const result = await response.json();

        if (result.success) {
          const formattedPlans = result.data.map((plan, index) => ({
            ...plan,
            icon: index === 0 ? <Star className="text-zinc-400" /> : 
                  index === 1 ? <Zap className="text-red-600" /> : 
                  <Crown className="text-amber-500" />,
            recommended: index === 1,
            description: plan.description || "Ethio Fit Premium Tier"
          }));
          setPlans(formattedPlans);
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // --- UPDATED SELECTION LOGIC FOR MULTI-PAGE ---
  const handleSelectPlan = (planName) => {
    // 1. Update the global state in App.jsx
    if (setSelectedPlan) {
      setSelectedPlan(planName);
    }
    
    // 2. Since Contact is a different page, navigate to it
    navigate("/contact");
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Plans...</p>
      </div>
    );
  }

  return (
    <section id="pricing" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm mb-4"
          >
            Membership Plans
          </motion.h2>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">
            Invest In <span className="text-red-600">Yourself</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                plan.recommended 
                ? "bg-white dark:bg-zinc-900 border-red-600 shadow-2xl scale-105 z-10 py-12" 
                : "bg-white/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-white/5 shadow-xl"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-black dark:text-white text-zinc-900 uppercase italic leading-none">{plan.name}</h3>
                  <p className="text-zinc-500 text-xs font-bold mt-2 uppercase tracking-wider">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black dark:text-white text-zinc-900">
                    {Number(plan.amount || plan.price).toLocaleString()}
                  </span>
                  <span className="text-zinc-500 font-bold uppercase text-xs">ETB / Mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600/10 flex items-center justify-center">
                      <Check className="text-red-600" size={12} strokeWidth={4} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handleSelectPlan(plan.name)} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  plan.recommended 
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/30 hover:bg-red-700" 
                  : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white"
                }`}
              >
                Choose Plan <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-12 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          * All plans include a one-time 500 ETB registration fee.
        </p>
      </div>
    </section>
  );
};

export default Pricing;