import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Target, Users, Instagram, Twitter, Linkedin, Star, MessageSquare, X } from "lucide-react";

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([
    {
      name: "Selamawit Kebede",
      role: "Member since 2022",
      quote: "Finding a dedicated, premium women's space in Addis changed everything for my fitness journey. The equipment is elite and the community keeps me accountable.",
      rating: 5
    },
    {
      name: "Helen Tekle",
      role: "Powerlifter",
      quote: "Elite Gym isn't just about cardio—the strength setups here are professional grade. It's empowering to train hard alongside focused, driven women.",
      rating: 5
    },
    {
      name: "Dr. Aster Mulu",
      role: "HIIT Enthusiast",
      quote: "The programming is scientifically optimized and the environment is incredibly pristine and supportive. Best athletic investment I've made.",
      rating: 5
    }
  ]);

  // Form States
  const [newClientName, setNewClientName] = useState("");
  const [newClientReview, setNewClientReview] = useState("");
  const [newClientRating, setNewClientRating] = useState(5);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!newClientName || !newClientReview) return;

    const newFeedback = {
      name: newClientName,
      role: "Verified Client",
      quote: newClientReview,
      rating: newClientRating
    };

    // Prepend new client feedback to array
    setFeedbackList([newFeedback, ...feedbackList]);

    // Reset fields and close out display interface 
    setNewClientName("");
    setNewClientReview("");
    setNewClientRating(5);
    setIsModalOpen(false);
  };

  const stats = [
    { label: "Elite Athletes", value: "500+" },
    { label: "Expert Coaches", value: "15" },
    { label: "Success Stories", value: "1k+" },
  ];

  const founders = [
    {
      name: "Marcus Thorne",
      role: "Head of Performance / Founder",
      bio: "Former strength operator with 15 years in conditioning, committed to building premier athletic spaces.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Sarah Vane",
      role: "Nutrition Director / Co-Founder",
      bio: "Elite nutrition coach focused on metabolic optimization, hormonal health, and female athletic longevity.",
      img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-red-600 font-black uppercase tracking-widest text-sm mb-4">Our Legacy</h2>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            No Limits. <span className="text-zinc-800">No Excuses.</span>
          </h1>
        </motion.div>

        {/* Brand Story Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xl text-zinc-400 leading-relaxed">
              Founded in 2018, <span className="text-white font-bold">ELITE GYM</span> stands proud as the first and premier women-only training facility in Ethiopia. We engineered this space for women who refuse to settle for average—a world-class forge where discipline meets raw power.
            </p>
            <p className="text-zinc-500">
              Our mission is to break boundaries by providing an elite environment, specialized equipment, and expert coaching designed to elevate female athletic performance. Whether you are a pro competitor or a beginner with a warrior mindset, you belong in this tribe.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-red-600">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[450px] bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden group"
          >
            <img 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              alt="Elite Gym Interior"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <div className="absolute bottom-8 left-8 z-20">
               <span className="text-white font-black text-4xl italic tracking-tighter">EST. 2018</span>
            </div>
          </motion.div>
        </div>

        {/* Meet the Founders Section */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-red-600 font-black uppercase tracking-widest text-sm mb-2">The Minds Behind</h2>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Meet The Founders</h1>
            </div>
            <p className="text-zinc-500 max-w-sm text-sm">Engineered by dedicated fitness authorities to provide an unparalleled, focused training environment.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col md:flex-row"
              >
                <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden">
                  <img src={founder.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={founder.name} />
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-black uppercase italic text-white mb-1">{founder.name}</h3>
                  <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">{founder.role}</p>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{founder.bio}</p>
                  <div className="flex gap-4">
                    <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Instagram size={16} /></a>
                    <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Twitter size={16} /></a>
                    <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Linkedin size={16} /></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { icon: <Target className="text-red-600" />, title: "Precision", desc: "Every movement, every rep—engineered for peak physical transformation." },
            { icon: <Shield className="text-red-600" />, title: "Discipline", desc: "We leave excuses at the door. We do whatever it takes to unlock true capability." },
            { icon: <Users className="text-red-600" />, title: "Community", desc: "Join an elite sisterhood of high-performers chasing stronger versions of themselves." }
          ].map((v, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-600/30 transition-all"
            >
              <div className="mb-4">{v.icon}</div>
              <h3 className="text-xl font-black uppercase italic mb-2">{v.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Client Feedback Matrix Layer */}
        <div className="pt-16 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-red-600 font-black uppercase tracking-widest text-sm mb-2">The Sisterhood Speaks</h2>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Client Feedback</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-red-600/10 transition-all focus:outline-none"
            >
              <MessageSquare size={14} /> Leave Your Review
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbackList.map((feedback, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 flex flex-col justify-between hover:border-zinc-800 transition-colors"
              >
                <div>
                  <div className="flex gap-0.5 mb-4 text-red-600">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-zinc-400 italic text-sm leading-relaxed mb-6">"{feedback.quote}"</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h4 className="text-sm font-black uppercase text-white tracking-tight">{feedback.name}</h4>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider block mt-0.5">{feedback.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Submission Overlay Console */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200]"
            />

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-zinc-950 border border-white/10 p-8 rounded-3xl z-[210] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Share Your Transformation</h2>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Submit Feedback</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-white p-2 rounded-lg bg-white/5 transition-colors focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="e.g., Tigist Assefa"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Rating</label>
                  <div className="flex gap-2 bg-zinc-900 border border-white/5 rounded-xl p-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewClientRating(star)}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <Star
                          size={20}
                          className={star <= newClientRating ? "text-red-600" : "text-zinc-700"}
                          fill={star <= newClientRating ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Your Experience</label>
                  <textarea
                    required
                    rows={4}
                    value={newClientReview}
                    onChange={(e) => setNewClientReview(e.target.value)}
                    placeholder="How has training at Elite Gym impacted your performance and lifestyle?"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors shadow-lg shadow-red-600/10 focus:outline-none mt-2"
                >
                  Broadcast Review
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;