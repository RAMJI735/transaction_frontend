import React, { useState, useEffect } from "react";
import { useIpo } from "../services/context/IpoContext";
import { X, TrendingUp, AlertCircle, Calculator, CheckCircle2 } from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const IpoModal = ({ isOpen, onClose, initialData = null }) => {
  const { addIpo, updateIpo, friendsList } = useIpo();

  const [ipoName, setIpoName] = useState("");
  const [friendName, setFriendName] = useState("Amit (Friend)");
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalAmount, setTotalAmount] = useState(15000);
  const [friendContribution, setFriendContribution] = useState(15000);
  const [myContribution, setMyContribution] = useState(0);
  const [status, setStatus] = useState("pending");
  const [isSold, setIsSold] = useState(false);
  const [sellAmount, setSellAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setIpoName(initialData.ipoName || "");
      setFriendName(initialData.friendName || "Amit (Friend)");
      setApplicationDate(initialData.applicationDate || new Date().toISOString().split("T")[0]);
      setTotalAmount(initialData.totalAmount || 15000);
      setFriendContribution(initialData.friendContribution !== undefined ? initialData.friendContribution : 15000);
      setMyContribution(initialData.myContribution || 0);
      setStatus(initialData.status || "pending");
      setIsSold(initialData.sellAmount !== null && initialData.sellAmount !== undefined);
      setSellAmount(initialData.sellAmount !== null && initialData.sellAmount !== undefined ? initialData.sellAmount : "");
      setNotes(initialData.notes || "");
    } else {
      setIpoName("");
      setFriendName(friendsList[0] || "Amit (Friend)");
      setApplicationDate(new Date().toISOString().split("T")[0]);
      setTotalAmount(15000);
      setFriendContribution(15000);
      setMyContribution(0);
      setStatus("pending");
      setIsSold(false);
      setSellAmount("");
      setNotes("");
    }
    setError("");
  }, [initialData, isOpen, friendsList]);

  if (!isOpen) return null;

  // Split presets
  const handlePreset = (type) => {
    const tot = Number(totalAmount) || 0;
    if (type === "friend100") {
      setFriendContribution(tot);
      setMyContribution(0);
    } else if (type === "split50") {
      const half = Math.round(tot / 2);
      setFriendContribution(half);
      setMyContribution(tot - half);
    } else if (type === "my100") {
      setFriendContribution(0);
      setMyContribution(tot);
    }
  };

  const handleTotalChange = (val) => {
    const num = Number(val) || 0;
    setTotalAmount(num);
    // Keep friend ratio or default to 100%
    if (myContribution === 0) {
      setFriendContribution(num);
    } else {
      const diff = Math.max(0, num - Number(friendContribution));
      setMyContribution(diff);
    }
  };

  const handleFriendContributionChange = (val) => {
    const num = Number(val) || 0;
    setFriendContribution(num);
    setMyContribution(Math.max(0, Number(totalAmount) - num));
  };

  // Calculations for preview
  const totAmt = Number(totalAmount) || 0;
  const friendCap = Number(friendContribution) || 0;
  const myCap = Number(myContribution) || 0;
  const sellNum = isSold && sellAmount !== "" ? Number(sellAmount) : null;
  const totalPL = sellNum !== null ? sellNum - totAmt : 0;
  const friendRatio = totAmt > 0 ? (friendCap / totAmt) : 1;
  const friendPL = sellNum !== null ? Math.round(totalPL * friendRatio) : 0;
  const myPL = totalPL - friendPL;
  const friendTotalReturn = status === "not_allotted" 
    ? friendCap 
    : status === "allotted" && sellNum !== null 
      ? friendCap + friendPL 
      : friendCap;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ipoName.trim()) {
      setError("Please enter the IPO Name");
      return;
    }
    if (totAmt <= 0) {
      setError("Total Application Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = {
      ipoName: ipoName.trim(),
      friendName: friendName.trim() || "Friend",
      applicationDate,
      totalAmount: totAmt,
      friendContribution: friendCap,
      myContribution: myCap,
      status,
      sellAmount: status === "allotted" && isSold && sellAmount !== "" ? Number(sellAmount) : null,
      notes: notes.trim()
    };

    let res;
    if (initialData?.id) {
      res = await updateIpo(initialData.id, payload);
    } else {
      res = await addIpo(payload);
    }

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || "Failed to save IPO");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">{initialData ? "Edit IPO Application" : "Apply for New IPO"}</h2>
              <p className="text-xs text-slate-400">Track capital pool & calculate exact profit share</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* IPO Name & Friend Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">IPO Company Name *</label>
              <input
                type="text"
                placeholder="e.g. Swiggy Ltd, Tata Tech"
                value={ipoName}
                onChange={(e) => setIpoName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Friend Name</label>
              <input
                type="text"
                placeholder="e.g. Amit (Friend)"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Application Date & Total Bid Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Date</label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Application Cost (₹) *</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => handleTotalChange(e.target.value)}
                required
                min="1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Capital Contribution Split */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Who funded this application?</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handlePreset("friend100")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    friendCap === totAmt && myCap === 0 ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Friend 100%
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset("split50")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    friendCap > 0 && friendCap === myCap ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  50 / 50 Split
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset("my100")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    myCap === totAmt && friendCap === 0 ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  My Wallet 100%
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Friend's Money (₹):
                </label>
                <input
                  type="number"
                  value={friendContribution}
                  onChange={(e) => handleFriendContributionChange(e.target.value)}
                  max={totalAmount}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  My Wallet Money (₹):
                </label>
                <input
                  type="number"
                  value={myContribution}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Allotment Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setStatus("pending"); setIsSold(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                  status === "pending"
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                🟡 Pending Allotment
              </button>
              <button
                type="button"
                onClick={() => setStatus("allotted")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                  status === "allotted"
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                🟢 Allotted!
              </button>
              <button
                type="button"
                onClick={() => { setStatus("not_allotted"); setIsSold(false); setSellAmount(""); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                  status === "not_allotted"
                    ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                🔵 Not Allotted (Refunded)
              </button>
            </div>
          </div>

          {/* If Not Allotted Notice */}
          {status === "not_allotted" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                <strong>100% Refund:</strong> Since shares were not allotted, the full {formatINR(totAmt)} is unblocked in your bank account with ₹0 loss. Friend's {formatINR(friendCap)} is returned to their liquid balance!
              </span>
            </div>
          )}

          {/* If Allotted - Sell Details */}
          {status === "allotted" && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">Listing Day Sale & Gain Details</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-emerald-900">
                  <input
                    type="checkbox"
                    checked={isSold}
                    onChange={(e) => setIsSold(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Shares Sold on Listing Day</span>
                </label>
              </div>

              {isSold ? (
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                    Total Proceeds from Selling All Shares (₹):
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25500"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <p className="text-xs text-emerald-800">
                  Shares are currently being held. Uncheck to record sell price whenever you sell.
                </p>
              )}
            </div>
          )}

          {/* Live Math Calculation Preview Card */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl text-xs space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
              <Calculator className="w-3.5 h-3.5" /> Live Settlement Preview for this IPO
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Friend's Capital Invested:</span>
              <span className="font-bold text-white">{formatINR(friendCap)}</span>
            </div>
            {status === "allotted" && isSold && sellNum !== null && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span>Total Listing Profit / Loss:</span>
                  <span className={`font-bold ${totalPL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {totalPL >= 0 ? `+${formatINR(totalPL)}` : formatINR(totalPL)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Friend's Profit Share ({Math.round(friendRatio * 100)}%):</span>
                  <span className={`font-bold ${friendPL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {friendPL >= 0 ? `+${formatINR(friendPL)}` : formatINR(friendPL)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between text-slate-100 pt-1 border-t border-slate-800 font-bold">
              <span>Friend's Net Return from this IPO:</span>
              <span className="text-emerald-400 font-black text-sm">{formatINR(friendTotalReturn)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Demat / Bank Details (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Applied via Zerodha UPI mandate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update IPO" : "Save IPO Application"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default IpoModal;

