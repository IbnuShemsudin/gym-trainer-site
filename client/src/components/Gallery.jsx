import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Camera, Zap } from "lucide-react";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);

  // SMART SYNC: Pulling from your MongoDB Atlas via your Backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gallery");
        setImages(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const categories = ["All", "Gym", "Boxing", "Yoga", "Bodybuilding"];
  
  // Filter logic remains smart and reactive
  const filteredImages = filter === "All" 
    ? images 
    : images.filter(img => img.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="gallery" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
              <Camera size={14} strokeWidth={3} /> Visual Results
            </div>
            <h1 className="text-5xl md:text-8xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter leading-none">
              The <span className="text-red-600">Vault.</span>
            </h1>
          </motion.div>

          {/* Smart Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  filter === cat 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105" 
                  : "text-zinc-500 hover:text-red-600 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Bento Grid */}
        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
             />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, index) => (
                <motion.div
                  key={img._id || img.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedImg(img.src || img.url)}
                  className={`relative group rounded-[2.5rem] overflow-hidden cursor-pointer border border-zinc-200 dark:border-white/5 shadow-xl ${
                    img.span || (index % 3 === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1")
                  }`}
                >
                  <img 
                    src={img.src || img.url} 
                    alt={img.title || img.label} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Pro Overlay: Heavy Glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} className="text-red-600 fill-red-600" />
                        <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em]">{img.category}</p>
                      </div>
                      <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none mb-4">
                        {img.title || img.label}
                      </h3>
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-widest group-hover:bg-red-600 transition-colors">
                        <Maximize2 size={16} /> View Detail
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal (Pro: Smooth Zoom) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImg(null)}
          >
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              className="absolute top-8 right-8 text-white p-2 bg-white/10 rounded-full border border-white/10"
            >
              <X size={32} />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              src={selectedImg} 
              className="max-w-full max-h-[85vh] rounded-[2rem] shadow-[0_0_80px_rgba(220,38,38,0.3)] border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;