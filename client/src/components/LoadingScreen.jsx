import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-2 border-transparent border-t-red-600 rounded-full"
        />
        
        {/* Pulsing Logo in Center */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
        >
          <h1 className="text-3xl font-black tracking-tighter text-white">
            <span className="bg-red-600 px-2 py-0.5 rounded mr-1">E</span>
            FIT
          </h1>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-zinc-500 font-black uppercase tracking-[0.5em] text-[10px]"
      >
        Forging Strength, Shaping Futures
        <span className="block mt-2 text-xs text-zinc-400 italic font-normal tracking-normal">Your Journey Begins Here
        </span>
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;