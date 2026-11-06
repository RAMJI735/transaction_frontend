import React, { useState } from "react";
import Navbar from "./Navbar";
import SummaryCards from "./SummaryCards";
import IpoTable from "./IpoTable";
import CashLedgerTable from "./CashLedgerTable";
import ChartsSection from "./ChartsSection";
import IpoModal from "./IpoModal";
import CashModal from "./CashModal";
import WhatsAppExplainer from "./WhatsAppExplainer";
import { TrendingUp, CreditCard, PieChart, Sparkles } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("ipos"); // "ipos" | "cash" | "analytics"
  
  // Modals state
  const [isIpoModalOpen, setIsIpoModalOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState(null);

  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashModalConfig, setCashModalConfig] = useState({ mode: "deposit", amount: "" });

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const handleOpenIpoModal = (ipoToEdit = null) => {
    setEditingIpo(ipoToEdit);
    setIsIpoModalOpen(true);
  };

  const handleOpenCashModal = ({ mode = "deposit", amount = "" }) => {
    setCashModalConfig({ mode, amount });
    setIsCashModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        onOpenIpoModal={() => handleOpenIpoModal(null)}
        onOpenCashModal={handleOpenCashModal}
        onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* KPI Summary Banner Cards */}
        <SummaryCards
          onOpenSettleModal={handleOpenCashModal}
          onOpenCashModal={handleOpenCashModal}
        />

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200/80 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab("ipos")}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
              activeTab === "ipos"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>IPO Applications & Allotments</span>
          </button>

          <button
            onClick={() => setActiveTab("cash")}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
              activeTab === "cash"
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Friend Cash & Settlement Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3.5 flex items-center gap-2 border-b-2 transition ${
              activeTab === "analytics"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Visual Analytics & P&L Charts</span>
          </button>
        </div>

        {/* Tab 1: IPO Applications */}
        {activeTab === "ipos" && (
          <div className="space-y-6">
            <IpoTable
              onOpenIpoModal={() => handleOpenIpoModal(null)}
              onEditIpo={(ipo) => handleOpenIpoModal(ipo)}
            />
          </div>
        )}

        {/* Tab 2: Cash & Repayments Ledger */}
        {activeTab === "cash" && (
          <div className="space-y-6">
            <CashLedgerTable onOpenCashModal={handleOpenCashModal} />
          </div>
        )}

        {/* Tab 3: Analytics & Charts */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <ChartsSection />
          </div>
        )}

      </main>

      {/* Modals */}
      <IpoModal
        isOpen={isIpoModalOpen}
        onClose={() => setIsIpoModalOpen(false)}
        initialData={editingIpo}
      />

      <CashModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        defaultType={cashModalConfig.mode}
        defaultAmount={cashModalConfig.amount}
      />

      <WhatsAppExplainer
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />

    </div>
  );
};

export default Dashboard;
