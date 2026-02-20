import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [images, setImages] = useState([]); // Base images
  const [filteredImages, setFilteredImages] = useState([]); // Filtered view
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gallery");
        
        // ✅ The Fix: Access res.data.data because of our new server response format
        const fetchedData = res.data.data || []; 
        
        setImages(fetchedData);
        setFilteredImages(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const filterGallery = (category) => {
    setActiveFilter(category);
    if (category === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === category));
    }
  };

  if (loading) return <div className="py-20 text-center text-zinc-500 uppercase tracking-widest">Loading Gallery...</div>;

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-12">
          {['all', 'bodybuilding', 'weight loss', 'training'].map((cat) => (
            <button
              key={cat}
              onClick={() => filterGallery(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === cat ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {/* ✅ Safety check: Ensure filteredImages is an array before mapping */}
            {Array.isArray(filteredImages) && filteredImages.map((image) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={image._id}
                className="relative aspect-square overflow-hidden group rounded-xl bg-zinc-900"
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-1">{image.category}</p>
                  <h3 className="text-white font-bold uppercase italic tracking-tighter">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredImages.length === 0 && (
          <p className="text-zinc-600 text-center py-20 italic">No images found in this category.</p>
        )}
      </div>
    </section>
  );
};

export default Gallery;