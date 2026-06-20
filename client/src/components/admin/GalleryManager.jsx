import React, { useState } from "react";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function GalleryManager({
  initialData = [], // 💡 Corresponds perfectly to initialData from AdminDashboard
  onRefresh,        // 💡 Re-pulls database data asynchronously after state alterations
}) {
  const baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const safeGallery = Array.isArray(initialData) ? initialData : [];

  // 🧠 Encapsulate form state locally to prevent wasteful global re-renders
  const [newImage, setNewImage] = useState({ title: "", url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚀 Creation submission pathway
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!newImage.title || !newImage.url) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseApiUrl}/api/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
        body: JSON.stringify(newImage),
      });

      if (res.ok) {
        setNewImage({ title: "", url: "" });
        onRefresh?.(); // Synchronize view state arrays
      }
    } catch (err) {
      console.error("Gallery entry upload sequence error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Deletion extraction pathway
  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media image asset?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseApiUrl}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });
      if (res.ok) onRefresh?.();
    } catch (err) {
      console.error("Gallery asset deletion engine failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. CREATION SUBMISSION ENTRY PANEL */}
      <form
        onSubmit={handleAddGallery}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-black/20 p-5 border border-white/5 rounded-2xl"
      >
        <input
          type="text"
          placeholder="Image Title (e.g., Cardio Deck)"
          value={newImage.title}
          onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
          className="bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
          required
        />

        <input
          type="url"
          placeholder="Image Address URL"
          value={newImage.url}
          onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
          className="bg-zinc-900 border border-white/5 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 h-full py-3 md:py-0 transition-colors duration-150"
        >
          <Plus size={16} />
          {isSubmitting ? "Uploading..." : "Deploy Asset"}
        </button>
      </form>

      {/* 2. MEDIA GRID DISPLAY CANVAS */}
      {safeGallery.length === 0 ? (
        <div className="py-20 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl bg-black/10 flex flex-col items-center justify-center gap-2">
          <ImageIcon size={32} className="text-zinc-700" />
          <p className="text-sm">Media showroom grid storage empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {safeGallery.map((img) => {
            // Safe fallback URL constructor mapping 
            const imageSource = img.url?.startsWith("http") 
              ? img.url 
              : `${baseApiUrl}/${img.url}`;

            return (
              <div
                key={img._id || img.id}
                className="relative rounded-2xl overflow-hidden border border-white/5 group bg-zinc-900/40 aspect-square"
              >
                {/* INTERACTIVE MEDIA ITEM */}
                <img
                  src={imageSource}
                  alt={img.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* PREMIUM GLASSMORPHIC METADATA FOOTER LAYER */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <p className="text-xs font-bold text-white truncate">{img.title || "Untitled Asset"}</p>
                </div>

                {/* SYSTEM DELETION OVERLAY CONTROLLER */}
                <button
                  type="button"
                  onClick={() => handleDeleteGallery(img._id || img.id)}
                  className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-red-500/30 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all duration-150 group"
                  title="Purge Image Asset"
                >
                  <Trash2
                    size={14}
                    className="text-zinc-400 group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}