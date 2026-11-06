import React, { useState, useEffect } from "react";
import { useIpo } from "../services/context/IpoContext";
import { X, HandCoins, SendHorizontal, AlertCircle } from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const CashModal = ({ isOpen, onClose, defaultType = "deposit", defaultAmount = "" }) => {
  const { addCashTransaction, friendsList, summary } = useIpo();
  const [friendName, setFriendName] = useState("Amit (Friend)");
  const [type, setType] = useState(defaultType); // "deposit" | "repayment"
  const [amount, setAmount] = useState(defaultAmount || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setType(defaultType || "deposit");
    if (defaultAmount) {
      setAmount(defaultAmount);
    } else {
      setAmount("");
    }
    setFriendName(friendsList[0] || "Amit (Friend)");
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentMode("UPI");
    setNotes(defaultType === "repayment" ? "Settled IPO balance" : "Received for upcoming IPOs");
    setError("");
  }, [isOpen, defaultType, defaultAmount, friendsList]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const res = await addCashTransaction({
      friendName: friendName.trim() || "Friend",
      type,
      amount: num,
      date,
      paymentMode,
      notes: notes.trim()
    });

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || "Failed to record transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className={`px-6 py-5 text-white flex items-center justify-between ${
          type === "deposit" ? "bg-slate-900" : "bg-gradient-to-r from-purple-900 to-indigo-900"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${type === "deposit" ? "bg-emerald-500/20 text-emerald-400" : "bg-purple-500/20 text-purple-400"}`}>
              {type === "deposit" ? <HandCoins className="w-5 h-5" /> : <SendHorizontal className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-black">
                {type === "deposit" ? "Record Friend Cash Deposit" : "Record Repayment to Friend"}
              </h2>
              <p className="text-xs text-slate-300">Keep audit trail 100% accurate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setType("deposit"); setNotes("Received for upcoming IPOs"); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                type === "deposit" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              + Friend Gave Money
            </button>
            <button
              type="button"
              onClick={() => { setType("repayment"); setNotes("Paid back IPO balance"); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                type === "repayment" ? "bg-purple-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              - I Paid Friend Back
            </button>
          </div>

          {/* Friend Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Friend Name</label>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="e.g. Amit (Friend)"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Amount (₹) *</label>
              {type === "repayment" && summary.liquidPayableNow > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(summary.liquidPayableNow)}
                  className="text-[11px] font-bold text-purple-600 hover:underline"
                >
                  Fill Liquid Due ({formatINR(summary.liquidPayableNow)})
                </button>
              )}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 15000"
              required
              min="1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Transaction Reference</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. PhonePe UTR #12345678"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 ${
                type === "deposit"
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isSubmitting ? "Saving..." : type === "deposit" ? "Save Cash Deposit" : "Record Repayment"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CashModal;

