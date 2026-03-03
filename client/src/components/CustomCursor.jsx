import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState("default");
  
  // Position of the cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for a "laggy" premium feel
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Listen for custom hover events
    const handleMouseOver = (e) => {
      if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".cursor-pointer")) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* The Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      
      {/* The Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-red-600 rounded-full pointer-events-none z-[9998]"
        style={{ 
          x: cursorX, 
          y: cursorY, 
          translateX: "-50%", 
          translateY: "-50%" 
        }}
        animate={{
          scale: cursorType === "hover" ? 2 : 1,
          backgroundColor: cursorType === "hover" ? "rgba(220, 38, 38, 0.1)" : "transparent",
        }}
      />
    </>
  );
};

export default CustomCursor;