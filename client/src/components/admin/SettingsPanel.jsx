import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, UserCog, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SettingsPanel({
  initialData = {}, // 💡 Maps directly to 'initialData' passed from AdminDashboard
  onRefresh,        // 💡 Hook to tell the dashboard to update global profile context
}) {
  const baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🧠 Local form state isolation to avoid rendering delays and input freezing
  const [profileInput, setProfileInput] = useState({
    displayName: "",
    password: "",
  });
  
  const [secretKeyString, setSecretKeyString] = useState("••••••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRotatingKey, setIsRotatingKey] = useState(false);

  // Sync incoming loaded dashboard profile records into the local state
  useEffect(() => {
    if (initialData?.admin) {
      setProfileInput((prev) => ({
        ...prev,
        displayName: initialData.admin.displayName || "",
      }));
    }
    if (initialData?.secretKey) {
      setSecretKeyString(initialData.secretKey);
    }
  }, [initialData]);

  // 🚀 Profile Update API Pipeline
  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseApiUrl}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
        body: JSON.stringify({
          displayName: profileInput.displayName,
          ...(profileInput.password ? { password: profileInput.password } : {}),
        }),
      });

      if (res.ok) {
        setProfileInput((prev) => ({ ...prev, password: "" }));
        alert("Admin profile metadata successfully synchronized.");
        onRefresh?.();
      }
    } catch (err) {
      console.error("Profile modification transaction failed:", err);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // 🔄 Key Rotation API Pipeline
  const handleRotateSecretKey = async () => {
    if (!window.confirm("Warning: Rotating the secret key will invalidate all existing user sessions. Continue?")) return;
    
    setIsRotatingKey(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseApiUrl}/api/admin/rotate-key`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSecretKeyString(data.secretKey || "New Key Generated");
        alert("Secret token rotation complete.");
        onRefresh?.();
      }
    } catch (err) {
      console.error("JWT environment key rotation error:", err);
    } finally {
      setIsRotatingKey(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. PROFILE MANAGEMENT FORM CARD */}
      <form
        onSubmit={handleUpdateAdminProfile}
        className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between"
      >
        <div>
          <h3 className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide mb-6 border-b border-white/5 pb-3">
            <UserCog size={16} className="text-zinc-500" />
            Admin Profile Config
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={profileInput.displayName}
                onChange={(e) => setProfileInput({ ...profileInput, displayName: e.target.value })}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-white/5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-1.5">
                Change Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current"
                  value={profileInput.password}
                  onChange={(e) => setProfileInput({ ...profileInput, password: e.target.value })}
                  className="w-full p-3 pr-10 rounded-xl bg-zinc-950 border border-white/5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="w-full mt-6 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors duration-150"
        >
          {isUpdatingProfile ? "Saving Metadata..." : "Save Changes"}
        </button>
      </form>

      {/* 2. SECURITY ENVIRONMENT ENVELOPE CARD */}
      <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide mb-6 border-b border-white/5 pb-3">
            <Lock size={16} className="text-zinc-500" />
            System Authentication Keys
          </h3>

          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            This token is responsible for signature authentication vectors. Rotating it logs out all active user sessions instantly.
          </p>

          <div className="bg-zinc-950 border border-white/5 p-4 rounded-xl text-xs font-mono text-zinc-400 break-all select-all tracking-tight shadow-inner">
            {secretKeyString}
          </div>
        </div>

        <button
          type="button"
          onClick={handleRotateSecretKey}
          disabled={isRotatingKey}
          className="w-full mt-6 border border-white/5 bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className={isRotatingKey ? "animate-spin" : ""} />
          {isRotatingKey ? "Recalibrating Token..." : "Generate New Key"}
        </button>
      </div>
    </div>
  );
}