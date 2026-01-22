import { motion } from "framer-motion";

const brands = [
  { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_complete_logo.svg" },
  { name: "Under Armour", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Under_Armour_logo.svg" },
  { name: "Reebok", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Reebok_2019_logo.svg" },
  { name: "Technogym", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Technogym_logo.svg" },
];

const BrandTicker = () => {
  return (
    <div className="py-12 bg-white dark:bg-black border-y border-zinc-100 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-600">
          Official Equipment & Apparel Partners
        </p>
      </div>

      <div className="flex relative">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-nowrap gap-20 items-center min-w-full"
        >
          {/* Double the list for seamless looping */}
          {[...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-8 md:h-10 w-auto object-contain dark:invert" 
              />
            </div>
          ))}
        </motion.div>
        
        {/* Faded edges for that "high-end" look */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
      </div>
    </div>
  );
};

export default BrandTicker;