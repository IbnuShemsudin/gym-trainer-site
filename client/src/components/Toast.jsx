import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed bottom-10 right-10 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
        type === "success" 
        ? "bg-green-500/10 border-green-500/20 text-green-500" 
        : "bg-red-500/10 border-red-500/20 text-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      
      <div className="flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">System Notification</p>
        <p className="text-sm font-bold tracking-tight text-white">{message}</p>
      </div>

      <button onClick={onClose} className="ml-4 hover:rotate-90 transition-transform">
        <X size={16} className="text-zinc-500" />
      </button>
    </motion.div>
  );
};

export default Toast;