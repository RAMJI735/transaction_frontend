import React, { useState } from "react";
import { useIpo } from "../services/context/IpoContext";
import { X, Copy, Check, MessageSquare, ExternalLink } from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const WhatsAppExplainer = ({ isOpen, onClose }) => {
  const { summary, ipos, selectedFriend } = useIpo();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const friend = selectedFriend !== "All" ? selectedFriend : "Friend";
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const {
    totalDepositsReceived = 0,
    totalRepaymentsMade = 0,
    totalFriendProfit = 0,
    totalFriendLoss = 0,
    netFriendProfitLoss = 0,
    totalNetOwedToFriend = 0,
    liquidPayableNow = 0,
    totalFriendLockedInPending = 0
  } = summary;

  // Build the message
  let ipoTextLines = [];
  ipos.forEach((ipo, idx) => {
    const friendCap = Number(ipo.friendContribution) || 0;
    const friendPL = Number(ipo.friendProfitLoss) || 0;
    if (ipo.status === "pending") {
      ipoTextLines.push(`${idx + 1}. *${ipo.ipoName}*: ₹${friendCap.toLocaleString("en-IN")} (⏳ Awaiting Allotment)`);
    } else if (ipo.status === "not_allotted") {
      ipoTextLines.push(`${idx + 1}. *${ipo.ipoName}*: ₹${friendCap.toLocaleString("en-IN")} (🔵 Not Allotted - 100% Refunded)`);
    } else if (ipo.status === "allotted") {
      if (ipo.sellAmount) {
        const sign = friendPL >= 0 ? "+" : "";
        ipoTextLines.push(`${idx + 1}. *${ipo.ipoName}*: ₹${friendCap.toLocaleString("en-IN")} (🟢 Allotted & Sold @ ₹${Number(ipo.sellAmount).toLocaleString("en-IN")}, Profit: ${sign}₹${friendPL.toLocaleString("en-IN")})`);
      } else {
        ipoTextLines.push(`${idx + 1}. *${ipo.ipoName}*: ₹${friendCap.toLocaleString("en-IN")} (🟢 Allotted - Holding)`);
      }
    }
  });

  const message = `📊 *IPO Settlement Statement for ${friend}*
📅 Date: ${today}

💰 *Cash Received & Repaid:*
• Total Money Received from You: ${formatINR(totalDepositsReceived)}
• Total Already Repaid to You: ${formatINR(totalRepaymentsMade)}

📈 *IPO Applications Breakdown:*
${ipoTextLines.length > 0 ? ipoTextLines.join("\n") : "• No IPOs recorded yet."}

✨ *Profit / Loss Summary:*
• Total Profit: +${formatINR(totalFriendProfit)}
${totalFriendLoss > 0 ? `• Total Loss: -${formatINR(totalFriendLoss)}\n` : ""}• Net Gain: ${netFriendProfitLoss >= 0 ? "+" : ""}${formatINR(netFriendProfitLoss)}

🎯 *FINAL SETTLEMENT CALCULATION:*
Received (${formatINR(totalDepositsReceived)}) + Profit (+${formatINR(netFriendProfitLoss)}) - Repaid (${formatINR(totalRepaymentsMade)})
👉 *TOTAL NET OWED TO YOU: ${formatINR(totalNetOwedToFriend)}*
   • 🟢 Ready to Transfer Right Now: ${formatINR(liquidPayableNow)}
   ${totalFriendLockedInPending > 0 ? `• ⏳ Locked in Pending IPOs: ${formatINR(totalFriendLockedInPending)}\n` : ""}
_Generated via IPO Friend Settlement Tracker - Zero Confusion!_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">Share Statement with Friend</h2>
              <p className="text-xs text-emerald-100">Send on WhatsApp to completely eliminate confusion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Preview of transparent settlement message ready to share with <strong>{friend}</strong>:
          </p>

          <pre className="p-4 bg-slate-900 text-emerald-300 rounded-2xl text-xs font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed border border-slate-800 shadow-inner">
            {message}
          </pre>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppExplainer;

