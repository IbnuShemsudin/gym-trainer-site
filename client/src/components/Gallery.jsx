import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

const images = [
  { id: 1, category: "Gym", src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070", title: "Iron Paradise" },
  { id: 2, category: "Boxing", src: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2187", title: "Heavy Hitter" },
  { id: 3, category: "Yoga", src: "https://images.unsplash.com/photo-1552196564-97c84853752e?q=80&w=1974", title: "Inner Zen" },
  { id: 4, category: "Gym", src: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070", title: "Power Clean" },
  { id: 5, category: "Yoga", src: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=2070", title: "Core Balance" },
  { id: 6, category: "Boxing", src: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974", title: "Elite Speed" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);

  const categories = ["All", "Gym", "Boxing", "Yoga"];
  const filteredImages = filter === "All" ? images : images.filter(img => img.category === filter);

  return (
    <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm mb-4">Our Facility</h2>
            <h1 className="text-4xl md:text-6xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">
              Inside <span className="text-red-600">The Forge</span>
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === cat 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                  : "text-zinc-500 hover:text-red-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer bg-zinc-200 dark:bg-zinc-900"
                onClick={() => setSelectedImg(img.src)}
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <motion.div 
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">{img.category}</p>
                      <h3 className="text-white text-2xl font-black italic uppercase">{img.title}</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20">
                      <Maximize2 className="text-white" size={20} />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-red-600 transition-colors">
              <X size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImg} 
              className="max-w-full max-h-full rounded-3xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;