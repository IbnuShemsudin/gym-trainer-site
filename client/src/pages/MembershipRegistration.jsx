import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Upload, Check, AlertCircle, ArrowLeft, 
  ShieldCheck, CreditCard, LogIn
} from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const tierRates = {
  "Standard": 2500,
  "Premium": 4500,
  "Elite": 8000
};

const MembershipRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const initialTier = location.state?.selectedTier || "Premium";
  const initialProgram = location.state?.selectedProgram || "Bodybuilding";

  const [tier, setTier] = useState(initialTier);
  const [program, setProgram] = useState(initialProgram);
  const [duration, setDuration] = useState(1);

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedPhone = localStorage.getItem("userPhone");
    if (storedName) setClientName(storedName);
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const getMultiplier = (months) => {
    if (months === 3) return 2.7;
    if (months === 12) return 9.6;
    return 1;
  };

  const calculateTotal = () => {
    const basePrice = tierRates[tier] || 4500;
    return Math.round(basePrice * getMultiplier(duration));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.length > 0 ? e.target.files[0] : null;
    if (!file) return;

    setScreenshot(file);
    setScreenshotName(file.name);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("");
    setIsSubmitting(true);

    if (!token) {
      setSubmissionError("Authentication missing. Please log into your account.");
      setIsSubmitting(false);
      return;
    }

    if (!clientName || !phone || !screenshot) {
      setSubmissionError("All operational deployment parameters must be filled.");
      setIsSubmitting(false);
      return;
    }

    // 💡 FIXED: Extract the raw file reference cleanly
    let finalFileBlob = screenshot;
    if (screenshot instanceof FileList) {
      finalFileBlob = screenshot;
    } else if (screenshot?.files && screenshot.files.length > 0) {
      finalFileBlob = screenshot.files;
    }

    if (!finalFileBlob || !(finalFileBlob instanceof Blob)) {
      setSubmissionError("Invalid asset type configuration. Please re-upload your transaction proof.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("tier", tier);
    formData.append("program", program);
    formData.append("durationMonths", Number(duration));
    formData.append("totalPaidETB", Number(calculateTotal()));
    formData.append("contactPhone", phone);
    formData.append("paymentProof", finalFileBlob, screenshotName || "receipt.png");

    try {
      // 💡 FIXED: Pass clean, standardized credentials standard
      const headers = {
        "Authorization": `Bearer ${token}`
      };

      const res = await fetch(`${BASE_API_URL}/api/memberships/apply`, {
        method: "POST",
        headers: headers,
        body: formData 
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        setSubmissionError("Your secure login session has expired. Redirecting to login gateway...");
        setTimeout(() => {
          navigate("/login", { state: { from: location } });
        }, 2500);
        return;
      }

      const responseText = await res.text();
      let data = {};
      
      try {
        data = JSON.parse(responseText);
      } catch (parseEngErr) {
        throw new Error("Server engine returned non-JSON tracking schema data.");
      }

      if (!res.ok) {
        const errorMsg = data.error || data.message || `Server Error: Status ${res.status}`;
        setSubmissionError(errorMsg);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Pipeline submission fault:", err);
      setSubmissionError(err.message || "Connection matrix failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#030303] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <LogIn size={28} />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">Authentication Required</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
            You must be signed into your profile account matrix before applying for premium tier credentials.
          </p>
          <button 
            onClick={() => navigate("/login", { state: { from: location } })}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg transition-all"
          >
            Access Core Login Gateway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-white pt-24 pb-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 mb-12 transition-colors group focus:outline-none"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back To Protocols
        </button>

        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: Summary Totalizer */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              <div>
                <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.4em] block mb-2">Admissions Core</span>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                  Tier <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-zinc-400">Subscription.</span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  Select your timeline parameters and drop your network transaction validation receipt token below to complete your lab access layer upgrade.
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-zinc-200 dark:border-white/5">
                  <div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Target Configuration</span>
                    <span className="text-xl font-black uppercase italic text-zinc-900 dark:text-white">{tier} Tier</span>
                  </div>
                  <span className="text-sm font-black text-red-600 bg-red-600/10 px-3 py-1 rounded-lg">{(tierRates[tier] || 0).toLocaleString()} ETB/Mo</span>
                </div>

                <div className="space-y-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Discipline Matrix:</span>
                    <span className="text-zinc-900 dark:text-white font-black">{program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horizon Timeline:</span>
                    <span className="text-zinc-900 dark:text-white font-black">{duration} Month{duration > 1 && 's'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-white/5 flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Aggregated Ledger Total</span>
                    <span className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{calculateTotal().toLocaleString()} <span className="text-xs uppercase tracking-normal">ETB</span></span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 text-white rounded-3xl p-6 border border-white/5 flex gap-4 items-start shadow-xl">
                <CreditCard className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs font-medium text-zinc-400 leading-relaxed">
                  <p className="font-black text-white uppercase tracking-wider mb-1">Direct Banking Protocol</p>
                  Deploy your subscription payment via CBE, Awash, or Telebirr interfaces. Upload the digital transfer receipt asset in the upload slot on the right.
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form Interface */}
            <div className="lg:col-span-7">
              <form onSubmit={handleApplicationSubmit} className="space-y-8 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12">
                
                {/* Tiers Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-3">Modify Access Protocol Tier</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {Object.keys(tierRates).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTier(t)}
                        className={`py-3.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all focus:outline-none ${
                          tier === t 
                          ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20" 
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Programs Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-3">Target Discipline Node</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {["Bodybuilding", "Cardio / Burn", "Powerlifting", "HIIT Ops", "Athletic Mobility"].map((prog) => (
                      <button
                        type="button"
                        key={prog}
                        onClick={() => setProgram(prog)}
                        className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all focus:outline-none ${
                          program === prog 
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white" 
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-700"
                        }`}
                      >
                        {prog}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Timeline */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-3">Subscription Horizon Cycle</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { label: "1 Month", val: 1, desc: "Standard Cycle" },
                      { label: "3 Months", val: 3, desc: "10% Bundle Save" },
                      { label: "Annual", val: 12, desc: "20% Absolute Save" }
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.val}
                        onClick={() => setDuration(item.val)}
                        className={`p-3 rounded-xl border text-left transition-all focus:outline-none ${
                          duration === item.val
                          ? "border-red-600 bg-red-600/5 dark:bg-red-600/10"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 hover:border-zinc-400 dark:hover:border-zinc-700"
                        }`}
                      >
                        <span className={`block text-xs font-black uppercase tracking-tight ${duration === item.val ? 'text-red-600' : 'text-zinc-900 dark:text-white'}`}>{item.label}</span>
                        <span className="block text-[8px] font-bold text-zinc-400 uppercase mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-zinc-200 dark:bg-white/10" />

                {/* Text Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Member Contact Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Abel Tesfaye"
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-red-600/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Active Contact Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g., 0911223344"
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-red-600/50"
                    />
                  </div>
                </div>

                {/* File Upload Slot */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">
                    Upload Bank Transfer Screenshot <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-red-600/30 rounded-2xl p-6 bg-white dark:bg-zinc-900/20">
                    <input 
                      type="file" 
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="text-zinc-400 mb-2" size={24} />
                      {screenshotName ? (
                        <span className="text-xs font-black text-red-600 uppercase tracking-tight max-w-sm truncate">{screenshotName}</span>
                      ) : (
                        <>
                          <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Attach Digital Receipt Document</span>
                          <span className="text-[9px] text-zinc-400 mt-1 font-bold uppercase tracking-wider">CBE, Awash, or Telebirr screenshots</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Errors Display */}
                <AnimatePresence>
                  {submissionError && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-red-500 dark:text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex gap-3 items-center"
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{submissionError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-red-600/10 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Syncing Structural Assets..." : "Submit Renewal Application"}
                </button>

              </form>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto py-20 flex flex-col items-center justify-center text-center"
          >
            <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 text-red-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white mb-4">Transfer Matrix Logged</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed mb-8">
              Your structural subscription update data has been queued. Administrators will confirm the bank ledger entry and update your member portal status dashboard shortly.
            </p>
            <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl mb-8">
              <ShieldCheck size={14} className="text-red-600" /> System State: Audit Pending Verification
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-widest border-b border-zinc-300 dark:border-zinc-700 pb-1 transition-colors"
            >
              Return To Your Personal Dashboard
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MembershipRegistration;