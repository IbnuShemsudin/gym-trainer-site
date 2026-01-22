import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    // Replace these with your actual IDs from EmailJS Dashboard
    emailjs.sendForm(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      form.current, 
      'YOUR_PUBLIC_KEY'
    )
    .then(() => {
        setStatus("success");
        form.current.reset();
        setTimeout(() => setStatus("idle"), 5000);
    }, (error) => {
        console.error(error.text);
        setStatus("error");
    });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        
        {/* Text Side */}
        <div>
          <h2 className="text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-none">
            Ready to join <br /><span className="text-red-600">The SweatBox?</span>
          </h2>
          <p className="mt-6 text-zinc-600 dark:text-zinc-400 max-w-md text-lg">
            Leave your details and our head trainer will contact you within 24 hours to schedule your physical assessment.
          </p>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/5"
        >
          <form ref={form} onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 dark:text-zinc-400 text-zinc-500">Full Name</label>
              <input 
                type="text" name="from_name" required
                className="w-full bg-zinc-100 dark:bg-black border-none rounded-xl p-4 focus:ring-2 ring-red-600 outline-none dark:text-white"
                placeholder="Your Full Name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 dark:text-zinc-400 text-zinc-500">Email Address</label>
              <input 
                type="email" name="from_email" required
                className="w-full bg-zinc-100 dark:bg-black border-none rounded-xl p-4 focus:ring-2 ring-red-600 outline-none dark:text-white"
                placeholder="your@gmail.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 dark:text-zinc-400 text-zinc-500">Your Goal</label>
              <textarea 
                name="message" required rows="4"
                className="w-full bg-zinc-100 dark:bg-black border-none rounded-xl p-4 focus:ring-2 ring-red-600 outline-none dark:text-white"
                placeholder="I want to gain muscle and improve my stamina..."
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === "sending"}
              className={`w-full py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                status === "success" ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {status === "idle" && <><Send size={18}/> Send Message</>}
              {status === "sending" && "Processing..."}
              {status === "success" && <><CheckCircle size={18}/> Sent Successfully!</>}
              {status === "error" && "Try Again"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;