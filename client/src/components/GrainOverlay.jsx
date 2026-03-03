import React from "react";

const GrainOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden opacity-[0.04]">
      <div 
        className="absolute inset-[-200%] w-[400%] h-[400%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat animate-grain"
      />
    </div>
  );
};

export default GrainOverlay;