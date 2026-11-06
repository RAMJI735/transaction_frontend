import React, { useState } from "react";
import { useIpo } from "../services/context/IpoContext";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  DollarSign, 
  HandCoins,
  SendHorizontal
} from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const SummaryCards = ({ onOpenSettleModal, onOpenCashModal }) => {
  const { summary, selectedFriend } = useIpo();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const {
    totalDepositsReceived = 0,
    totalRepaymentsMade = 0,
    totalFriendProfit = 0,
    totalFriendLoss = 0,
    netFriendProfitLoss = 0,
    totalNetOwedToFriend = 0,
    liquidPayableNow = 0,
    totalFriendLockedInPending = 0,
    totalFriendRefundedFromNotAllotted = 0,
    myTotalInvested = 0,
    myNetProfitLoss = 0
  } = summary;

  const isProfit = netFriendProfitLoss >= 0;

  return (
    <div className="space-y-4">
      {/* Top Banner - Hero Card for Exactly What You Owe */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Number Section */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Crystal Clear Settlement Formula</span>
              <button
                type="button"
                onClick={() => setShowFormulaModal(true)}
                className="hover:text-white underline ml-1 cursor-pointer flex items-center gap-1"
              >
                (How is this calculated?)
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 text-sm font-medium">
                Total Net Amount Owed to {selectedFriend !== "All" ? selectedFriend : "Friend"}
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {formatINR(totalNetOwedToFriend)}
                </h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                  isProfit ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isProfit ? `+${formatINR(netFriendProfitLoss)} Total P&L` : `${formatINR(netFriendProfitLoss)} Net Loss`}
                </span>
              </div>
            </div>

            {/* Sub-breakdown: Liquid vs Locked */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ready to Pay Back Right Now:</span>
                  <span className="text-emerald-300 font-bold text-sm">{formatINR(liquidPayableNow)}</span>
                  <span className="text-emerald-500/80 text-[10px] ml-1">(Liquid/Refunded)</span>
                </div>
              </div>

              {totalFriendLockedInPending > 0 && (
                <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Currently Locked in Pending IPOs:</span>
                    <span className="text-amber-300 font-bold text-sm">{formatINR(totalFriendLockedInPending)}</span>
                    <span className="text-amber-500/80 text-[10px] ml-1">(Awaiting Allotment)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions in Banner */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={() => onOpenSettleModal({ amount: Math.max(0, liquidPayableNow), mode: "repayment" })}
              className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              <SendHorizontal className="w-4 h-4" />
              Pay / Settle Liquid Balance ({formatINR(liquidPayableNow)})
            </button>

            <button
              onClick={() => onOpenCashModal({ mode: "deposit" })}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl border border-white/20 transition flex items-center justify-center gap-2"
            >
              <HandCoins className="w-4 h-4 text-emerald-400" />
              + Record Money Received From Friend
            </button>
          </div>

        </div>
      </div>

      {/* Grid of Key Sub-Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Received from Friend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Friend Deposits</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800">{formatINR(totalDepositsReceived)}</h3>
            <p className="text-xs text-slate-500 mt-1">Total money friend sent you</p>
          </div>
        </div>

        {/* Card 2: Friend Net Profit / Loss */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Friend IPO Gains</span>
            <div className={`p-2 rounded-xl ${isProfit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {isProfit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
              {isProfit ? `+${formatINR(netFriendProfitLoss)}` : formatINR(netFriendProfitLoss)}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="text-emerald-600 font-semibold">+{formatINR(totalFriendProfit)} Profit</span>
              {totalFriendLoss > 0 && (
                <span className="text-rose-500 font-semibold">-{formatINR(totalFriendLoss)} Loss</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Already Paid Back */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Already Repaid</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <SendHorizontal className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800">{formatINR(totalRepaymentsMade)}</h3>
            <p className="text-xs text-slate-500 mt-1">Transferred back via UPI/Bank</p>
          </div>
        </div>

        {/* Card 4: My Own Wallet & Share */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Own Money</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800">{formatINR(myTotalInvested)}</h3>
            <div className="text-xs text-slate-500 mt-1">
              <span>My Own P&L: </span>
              <span className={`font-bold ${myNetProfitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {myNetProfitLoss >= 0 ? `+${formatINR(myNetProfitLoss)}` : formatINR(myNetProfitLoss)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Formula Explanation Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                The Exact Settlement Math
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>1. Total Cash Received from Friend:</span>
                <span className="font-bold text-slate-900">{formatINR(totalDepositsReceived)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-600">
                <span>2. Friend's Profit from Allotted IPOs (+):</span>
                <span className="font-bold">+{formatINR(totalFriendProfit)}</span>
              </div>
              {totalFriendLoss > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                  <span>3. Friend's Loss from IPOs (-):</span>
                  <span className="font-bold">-{formatINR(totalFriendLoss)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200 text-purple-600">
                <span>4. Money You Already Paid Back (-):</span>
                <span className="font-bold">-{formatINR(totalRepaymentsMade)}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-black text-slate-900">
                <span>= Total Net Owed to Friend:</span>
                <span className="text-indigo-600">{formatINR(totalNetOwedToFriend)}</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" /> Why is Liquid Balance different from Total Owed?
              </p>
              <p>
                When an IPO is <strong>Pending</strong>, the money is blocked in your bank account via UPI ASBA. Once allotment is announced:
              </p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
                <li>If <strong>Not Allotted</strong>: The blocked money is released back to your bank account with ₹0 loss.</li>
                <li>If <strong>Allotted</strong>: You sell shares on listing day, and profit/proceeds are split proportionally!</li>
              </ul>
            </div>

            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
            >
              Understood, Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCards;

