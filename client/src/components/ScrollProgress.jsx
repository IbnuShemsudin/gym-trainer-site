import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[4px] bg-red-600 origin-left z-[200]"
    />
  );
};

export default ScrollProgress;