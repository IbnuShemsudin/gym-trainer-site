import { motion } from "framer-motion";
import { Shield, Target, Users, Instagram, Twitter, Linkedin } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Elite Athletes", value: "500+" },
    { label: "Expert Coaches", value: "15" },
    { label: "Success Stories", value: "1k+" },
  ];

  const founders = [
    {
      name: "Marcus Thorne",
      role: "Head of Performance / Founder",
      bio: "Former special forces operator with 15 years in strength and conditioning.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Sarah Vane",
      role: "Nutrition Director / Co-Founder",
      bio: "Olympic-level nutrition coach focused on metabolic optimization and longevity.",
      img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
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
              Founded in 2018, <span className="text-white font-bold">SWEATBOX</span> was built for those who refuse to settle for average. We aren't just a gym; we are a forge where discipline meets raw power.
            </p>
            <p className="text-zinc-500">
              Our mission is to provide the elite environment, equipment, and coaching necessary to push human performance beyond perceived limits. Whether you're a pro athlete or a beginner with a warrior mindset, you belong here.
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
              alt="Gym Interior"
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
            <p className="text-zinc-500 max-w-sm text-sm">Engineered by world-class athletes to provide a training experience like no other.</p>
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
                    <Instagram size={16} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                    <Twitter size={16} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                    <Linkedin size={16} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="text-red-600" />, title: "Precision", desc: "Every movement, every rep—engineered for peak performance." },
            { icon: <Shield className="text-red-600" />, title: "Discipline", desc: "We don't do easy. We do whatever it takes to win." },
            { icon: <Users className="text-red-600" />, title: "Community", desc: "Join a tribe of high-performers chasing elite versions of themselves." }
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
      </div>
    </div>
  );
};

export default About;