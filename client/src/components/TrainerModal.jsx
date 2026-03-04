import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Target, Quote, Calendar, ArrowRight } from "lucide-react";

const TrainerModal = ({ trainer, isOpen, onClose }) => {
  if (!trainer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[850px]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors border border-white/10"
            >
              <X size={20} />
            </button>

            {/* Left: Image Hero */}
            <div className="w-full md:w-1/2 h-80 md:h-auto relative">
              <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent md:hidden" />
            </div>

            {/* Right: Intelligence/Bio */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center overflow-y-auto">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-red-600" />
                    <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px]">Active Protocol</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-tight">
                    {trainer.name.split(' ')[0]} <br />
                    <span className="text-red-600">{trainer.name.split(' ')[1]}</span>
                  </h2>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">{trainer.specialty}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <Quote className="text-red-600 shrink-0" size={24} />
                    <p className="text-zinc-300 italic text-lg leading-relaxed">
                      "Training isn't just about the physical load; it's about the mental resilience required to sustain the protocol."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {trainer.stats.map((stat, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <span className="text-red-600">{stat.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Next Available Slot</h4>
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-red-600 text-white group cursor-pointer hover:bg-red-700 transition-all">
                    <div className="flex items-center gap-4">
                      <Calendar size={20} />
                      <span className="font-black italic uppercase tracking-tight">Monday • 08:00 AM</span>
                    </div>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrainerModal;