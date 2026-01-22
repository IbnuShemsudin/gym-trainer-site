import { motion } from "framer-motion";
// ADDED Dumbbell and Flower2 to the imports below
import { User, Award, Zap, Heart, Star, Dumbbell, Flower2 } from "lucide-react";

const trainers = [
  {
    name: "Aisha Mohammed",
    specialty: "Strength & Conditioning",
    image: "https://images.unsplash.com/photo-1594918731473-b3a61f5f24f0?q=80&w=1964&auto=format&fit=crop",
    stats: [
      { icon: <Dumbbell size={18} />, value: "10+ Years Experience" },
      { icon: <Award size={18} />, value: "Certified CSCS" },
      { icon: <Zap size={18} />, value: "Powerlifting Coach" },
    ],
  },
  {
    name: "Samuel Kebede",
    specialty: "HIIT & Cardio",
    image: "https://images.unsplash.com/photo-1547796903-8d266ec015c7?q=80&w=1974&auto=format&fit=crop",
    stats: [
      { icon: <Zap size={18} />, value: "Energy & Endurance" },
      { icon: <Star size={18} />, value: "Marathon Runner" },
      { icon: <Heart size={18} />, value: "Nutrition Advisor" },
    ],
  },
  {
    name: "Lema Getachew",
    specialty: "Yoga & Flexibility",
    image: "https://images.unsplash.com/photo-1601672322521-72993b8e4e97?q=80&w=1935&auto=format&fit=crop",
    stats: [
      { icon: <Flower2 size={18} />, value: "Certified Yogi" },
      { icon: <Heart size={18} />, value: "Mind-Body Balance" },
      { icon: <Award size={18} />, value: "Rehabilitation Focus" },
    ],
  },
  {
    name: "Sofia Abera",
    specialty: "Personal Coaching",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    stats: [
      { icon: <User size={18} />, value: "Goal-Oriented Plans" },
      { icon: <Star size={18} />, value: "Holistic Approach" },
      { icon: <Zap size={18} />, value: "Motivation Expert" },
    ],
  },
];

const Trainers = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-600 font-bold uppercase tracking-[0.3em] text-sm mb-4"
          >
            Meet Our Experts
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter"
          >
            Elite <span className="text-red-600">Coaches</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((trainer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover="hover"
              className="relative group rounded-[2rem] overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={trainer.image} 
                  alt={trainer.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-red-900/80 transition-all duration-500" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-black italic mb-1 uppercase tracking-tighter">{trainer.name}</h3>
                <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mb-4">{trainer.specialty}</p>

                <motion.div
                  className="space-y-2 overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-in-out"
                >
                  {trainer.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10"
                    >
                      <span className="text-red-500">{stat.icon}</span>
                      <span>{stat.value}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;