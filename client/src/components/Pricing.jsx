import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "1,500",
    description: "Perfect for casual trainers",
    features: ["Access to Gym Floor", "Locker Room & Showers", "2 Group Classes/Mo", "Mobile App Access"],
    icon: <Star className="text-zinc-400" />,
    recommended: false,
  },
  {
    name: "Pro",
    price: "2,800",
    description: "Most popular for results",
    features: ["Everything in Starter", "Unlimited Group Classes", "1 PT Consultation/Mo", "Sauna & Steam Access", "Free Guest Pass (1/Mo)"],
    icon: <Zap className="text-red-600" />,
    recommended: true,
  },
  {
    name: "Elite",
    price: "5,000",
    description: "For the dedicated athlete",
    features: ["Everything in Pro", "Weekly Personal Training", "Nutrition Coaching", "Recovery Zone Access", "Exclusive EthioFit Gear"],
    icon: <Crown className="text-amber-500" />,
    recommended: false,
  },
];

const Pricing = () => {
  return (
    /* Change 1: Removed bg-zinc-50 and added bg-transparent to let the App.jsx black show through */
    <section id="pricing" className="py-24 px-6 bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              /* Change 2: Updated card colors for true black backgrounds */
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                plan.recommended 
                ? "bg-white dark:bg-zinc-900 border-red-600 shadow-[0_20px_50px_rgba(220,38,38,0.2)] scale-105 z-10 py-12" 
                : "bg-white/80 dark:bg-zinc-950/50 border-zinc-200 dark:border-white/5 shadow-xl backdrop-blur-sm"
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
                  <span className="text-4xl font-black dark:text-white text-zinc-900">{plan.price}</span>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  plan.recommended 
                  ? "bg-red-600 text-white shadow-xl shadow-red-600/30 hover:bg-red-700" 
                  /* Change 3: Dark mode button text/bg tweaks */
                  : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white"
                }`}
              >
                Choose Plan <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center mt-12 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          * All plans include a one-time 500 ETB registration fee.
        </p>
      </div>
    </section>
  );
};

export default Pricing;