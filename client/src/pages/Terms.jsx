import React from "react";
import { motion } from "framer-motion";
import { Scale, AlertTriangle, CreditCard, Ban, FileText, CheckCircle2 } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
            <Scale className="text-red-600" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Legal Framework</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 dark:text-white">
            Operational <span className="text-red-600">Terms</span>
          </h1>
        </header>

        <div className="space-y-12">
          {/* Health Waiver */}
          <section className="relative p-10 rounded-[3rem] bg-red-600 text-white shadow-2xl shadow-red-600/10 overflow-hidden">
            <AlertTriangle className="absolute -right-10 -bottom-10 size-48 opacity-10" />
            <h2 className="text-2xl font-black uppercase italic mb-4 flex items-center gap-3">
              <CheckCircle2 size={24} /> Health Liability
            </h2>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              By engaging in EthioFit protocols, you acknowledge that high-intensity training carries inherent risks. You certify that you are medically cleared for physical exertion. EthioFit is not liable for injuries resulting from improper use of equipment or failure to follow coach directives.
            </p>
          </section>

          {/* Membership & Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-[2rem] border border-zinc-200 dark:border-white/5 dark:text-white">
              <CreditCard className="text-red-600 mb-4" />
              <h3 className="text-lg font-black uppercase italic mb-2">Billing Cycles</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Memberships are billed every 30 days. Failed payments result in immediate "Identity Gate" lockout until the balance is resolved.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] border border-zinc-200 dark:border-white/5 dark:text-white">
              <Ban className="text-red-600 mb-4" />
              <h3 className="text-lg font-black uppercase italic mb-2">Cancellation</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Protocol termination requires a 14-day notice period. No-shows for booked sessions may result in a "Credit Deduction."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;