import React, { useState } from "react";
import { useIpo } from "../services/context/IpoContext";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Pencil, 
  Trash2, 
  PlusCircle, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const IpoTable = ({ onOpenIpoModal, onEditIpo }) => {
  const { ipos, deleteIpo, loading } = useIpo();
  const [filterStatus, setFilterStatus] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const filteredIpos = ipos.filter(ipo => {
    if (filterStatus === "all") return true;
    return ipo.status === filterStatus;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setDeletingId(id);
      await deleteIpo(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-800">IPO Applications & Allotment Status</h3>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {filteredIpos.length} {filteredIpos.length === 1 ? "IPO" : "IPOs"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual IPO breakdown showing friend's invested capital, status and listing returns
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filterStatus === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({ipos.length})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filterStatus === "pending" ? "bg-amber-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus("allotted")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filterStatus === "allotted" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Allotted
          </button>
          <button
            onClick={() => setFilterStatus("not_allotted")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filterStatus === "not_allotted" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Refunded
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">IPO Company</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4">Capital Contribution</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Listing / Sell Amount</th>
              <th className="py-3.5 px-4 text-right">Friend's Net Return</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {filteredIpos.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                  <TrendingUp className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">No IPO applications found in this filter</p>
                  <button
                    onClick={() => onOpenIpoModal()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    <PlusCircle className="w-4 h-4" /> Apply for an IPO now
                  </button>
                </td>
              </tr>
            ) : (
              filteredIpos.map((ipo) => {
                const friendCap = Number(ipo.friendContribution) || 0;
                const myCap = Number(ipo.myContribution) || 0;
                const friendPL = Number(ipo.friendProfitLoss) || 0;
                const isGain = friendPL >= 0;
                const friendGross = ipo.friendGrossReturn !== undefined 
                  ? ipo.friendGrossReturn 
                  : (ipo.status === "not_allotted" ? friendCap : friendCap + friendPL);

                return (
                  <tr key={ipo.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* IPO Company & Friend */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-black text-slate-900 text-sm">{ipo.ipoName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {ipo.friendName || "Friend"}
                        </span>
                        {ipo.notes && (
                          <span className="text-slate-400 italic truncate max-w-xs">&bull; {ipo.notes}</span>
                        )}
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-4 text-slate-600">
                      {ipo.applicationDate || "N/A"}
                    </td>

                    {/* Capital Split */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900">{formatINR(ipo.totalAmount)}</div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-emerald-700 font-semibold">Friend: {formatINR(friendCap)}</span>
                          {myCap > 0 && (
                            <span className="text-slate-400">| You: {formatINR(myCap)}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {ipo.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending
                        </span>
                      )}
                      {ipo.status === "allotted" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Allotted
                        </span>
                      )}
                      {ipo.status === "not_allotted" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Refunded
                        </span>
                      )}
                    </td>

                    {/* Listing / Sell Amount */}
                    <td className="py-4 px-4">
                      {ipo.status === "not_allotted" ? (
                        <span className="text-slate-400 italic">N/A (Refunded 100%)</span>
                      ) : ipo.status === "pending" ? (
                        <span className="text-slate-400 italic">Awaiting Allotment</span>
                      ) : ipo.sellAmount ? (
                        <div>
                          <div className="font-bold text-slate-900">{formatINR(ipo.sellAmount)}</div>
                          <div className={`text-[11px] font-bold ${ipo.totalProfitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {ipo.totalProfitLoss >= 0 ? `+${formatINR(ipo.totalProfitLoss)} Gain` : `${formatINR(ipo.totalProfitLoss)} Loss`}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-semibold text-[11px]">
                          Holding (Unsold)
                        </span>
                      )}
                    </td>

                    {/* Friend's Net Return */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-black text-sm text-slate-900">
                        {formatINR(friendGross)}
                      </div>
                      {ipo.status === "allotted" && ipo.sellAmount && (
                        <div className={`text-[11px] font-bold ${isGain ? "text-emerald-600" : "text-rose-600"}`}>
                          {isGain ? `(+${formatINR(friendPL)} profit)` : `(-${formatINR(Math.abs(friendPL))} loss)`}
                        </div>
                      )}
                      {ipo.status === "not_allotted" && (
                        <div className="text-[10px] text-blue-600 font-semibold">
                          (Principal Unblocked)
                        </div>
                      )}
                      {ipo.status === "pending" && (
                        <div className="text-[10px] text-amber-600 font-semibold">
                          (Funds Blocked)
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEditIpo(ipo)}
                          title="Edit IPO / Update Status"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ipo.id, ipo.ipoName)}
                          disabled={deletingId === ipo.id}
                          title="Delete IPO"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default IpoTable;

