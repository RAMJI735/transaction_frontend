import React from "react";
import { useAuth } from "../services/context/AuthContext";
import { useIpo } from "../services/context/IpoContext";
import { 
  TrendingUp, 
  PlusCircle, 
  HandCoins, 
  LogOut, 
  User, 
  Users, 
  Share2, 
  RefreshCw 
} from "lucide-react";

const Navbar = ({ onOpenIpoModal, onOpenCashModal, onOpenWhatsAppModal }) => {
  const { user, logout } = useAuth();
  const { selectedFriend, setSelectedFriend, friendsList, fetchSummary, loading } = useIpo();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  IPO Friend
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">
                  Zero Confusion
                </span>
              </div>
              <p className="text-slate-400 text-xs hidden md:block">
                Track shared capital, IPO listing profit & friend settlements
              </p>
            </div>
          </div>

          {/* Center: Friend Filter */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Friend Filter:</span>
            <select
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-800 text-white">All Friends (Combined)</option>
              {friendsList.map(name => (
                <option key={name} value={name} className="bg-slate-800 text-white">{name}</option>
              ))}
            </select>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Refresh button */}
            <button
              onClick={() => fetchSummary()}
              disabled={loading}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* WhatsApp Share Summary */}
            <button
              onClick={onOpenWhatsAppModal}
              title="Generate WhatsApp Friendly Statement"
              className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp Share</span>
            </button>

            {/* Record Cash Button */}
            <button
              onClick={() => onOpenCashModal({ mode: "deposit" })}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <HandCoins className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Friend Cash</span>
            </button>

            {/* Apply New IPO Button */}
            <button
              onClick={() => onOpenIpoModal()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply IPO</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400" title={user?.email}>
                {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <button
                onClick={logout}
                title="Logout session"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
