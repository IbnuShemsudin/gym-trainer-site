import React from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, Database, HardDrive, Bell } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      title: "Data Acquisition",
      icon: <Eye className="text-red-600" />,
      content: "We collect 'Vector IDs' (emails), biometric performance data (heart rate, body comp), and interaction logs to optimize your training protocols."
    },
    {
      title: "Security Encryption",
      icon: <Lock className="text-red-600" />,
      content: "All identity data is stored using AES-256 encryption. Your 'Access Keys' are never stored in plain text and are hashed at the system level."
    },
    {
      title: "Third-Party Neural Links",
      icon: <Database className="text-red-600" />,
      content: "We do not sell your data. We only share necessary metrics with integrated fitness hardware (wearables) to track your progress."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
            <Shield className="text-red-600" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 text-zinc-400">Security Directive 01</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 dark:text-white">
            Privacy <span className="text-red-600">Protocol</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Effective Date: March 2026</p>
        </header>

        <div className="grid gap-8">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5"
            >
              <div className="flex items-center gap-4 mb-4">
                {section.icon}
                <h3 className="text-xl font-black uppercase italic dark:text-white">{section.title}</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <footer className="mt-16 p-8 border-t border-zinc-200 dark:border-white/5 text-center">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            Questions regarding data integrity? Contact <span className="text-red-600">security@ethiofit.com</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Privacy;