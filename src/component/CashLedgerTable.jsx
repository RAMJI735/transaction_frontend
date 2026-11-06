import React, { useState } from "react";
import { useIpo } from "../services/context/IpoContext";
import { 
  HandCoins, 
  SendHorizontal, 
  Trash2, 
  PlusCircle, 
  Calendar,
  CreditCard
} from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const CashLedgerTable = ({ onOpenCashModal }) => {
  const { cashTransactions, deleteCashTransaction } = useIpo();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cash transaction?")) {
      setDeletingId(id);
      await deleteCashTransaction(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-800">Friend Cash Ledger & Settlements History</h3>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {cashTransactions.length} {cashTransactions.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of money given by friend (inflow) and repaid back to friend (outflow)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCashModal({ mode: "deposit" })}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <HandCoins className="w-4 h-4 text-emerald-600" />
            + Friend Deposit
          </button>
          <button
            onClick={() => onOpenCashModal({ mode: "repayment" })}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <SendHorizontal className="w-4 h-4 text-purple-600" />
            + Pay Back Friend
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Date</th>
              <th className="py-3.5 px-4">Transaction Type</th>
              <th className="py-3.5 px-4">Friend</th>
              <th className="py-3.5 px-4">Payment Mode</th>
              <th className="py-3.5 px-4">Notes / Reference</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {cashTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400 space-y-1">
                  <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No cash transactions recorded yet</p>
                  <p className="text-xs">Record when your friend gives you money or when you repay them</p>
                </td>
              </tr>
            ) : (
              cashTransactions.map((tx) => {
                const isDeposit = tx.type === "deposit";
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 sm:px-6 text-slate-600">
                      {tx.date || "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      {isDeposit ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <HandCoins className="w-3.5 h-3.5 text-emerald-600" /> Friend Gave Money (Deposit)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <SendHorizontal className="w-3.5 h-3.5 text-purple-600" /> Paid Back Friend (Repayment)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {tx.friendName || "Friend"}
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {tx.paymentMode || "UPI"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                      {tx.notes || "—"}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className={`font-black text-sm ${isDeposit ? "text-emerald-600" : "text-purple-600"}`}>
                        {isDeposit ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        title="Delete record"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CashLedgerTable;

