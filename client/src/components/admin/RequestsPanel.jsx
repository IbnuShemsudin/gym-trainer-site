import React, { useState } from "react";

// 🔥 FIX: Accept 'data' and 'onRefresh' directly from the AdminDashboard parent component wrapper
const RequestsPanel = ({ data: requests = [], onRefresh }) => {
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox modal state

  // 1. APPROVE THE SELECTION ACTION
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // 🔥 FIX: Call onRefresh to instantly sync the master metrics in the Admin Dashboard!
        if (onRefresh) onRefresh();
      } else {
        const result = await res.json();
        alert(result.message || "Failed to process approval.");
      }
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // 2. REJECT THE SELECTION ACTION
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}/reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // 🔥 FIX: Call onRefresh to instantly clean up dashboard metrics
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error("Rejection error:", err);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Membership Verifications</h1>
        <p className="text-gray-400 text-sm mt-1">Review bank transfers and activate active member portal privileges.</p>
      </header>

      {requests.length === 0 ? (
        <div className="p-8 border border-dashed border-gray-800 rounded-xl text-center text-gray-500">
          No pending enrollment audits queued up inside the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                {/* Applicant Bio Profile Info */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-100">{req.name}</h3>
                    <p className="text-xs text-zinc-400">{req.email}</p>
                    <p className="text-xs text-zinc-400">{req.phone || "No phone added"}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                    {req.tier || "Standard Tier"}
                  </span>
                </div>

                <div className="border-t border-zinc-800 my-3 pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-500">Transferred Ledger:</span>
                    <span className="font-mono text-emerald-400 font-bold">{req.totalPaidETB} ETB</span>
                  </div>
                </div>

                {/* PAYMENT SCREENSHOT ASSET DISPLAY */}
                <div className="mt-3">
                  <label className="text-xs text-zinc-500 block mb-1.5">Bank Proof Asset:</label>
                  {req.paymentProof ? (
                    <div 
                      onClick={() => setSelectedImage(`http://localhost:5000${req.paymentProof}`)}
                      className="group relative h-40 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer"
                    >
                      <img 
                        src={`http://localhost:5000${req.paymentProof}`} 
                        alt="Bank receipt proof asset artifact" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x300/18181b/71717a?text=Receipt+Image+Missing";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium text-white">
                        Click to Expand Preview
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 text-xs text-zinc-600">
                      No document proof provided
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION TOGGLE TRIGGER BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleReject(req._id)}
                  className="py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-sm font-medium transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleApprove(req._id)}
                  className="py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-medium transition-colors shadow-lg"
                >
                  Approve Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPANDED RECEIPT MODAL LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
            <img 
              src={selectedImage} 
              alt="Expanded high-res artifact audit" 
              className="max-w-full max-h-[80vh] object-contain block mx-auto p-2"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPanel;