import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const IpoContext = createContext();

export const IpoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [ipos, setIpos] = useState([]);
  const [cashTransactions, setCashTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalDepositsReceived: 0,
    totalRepaymentsMade: 0,
    totalFriendCapitalApplied: 0,
    totalFriendLockedInPending: 0,
    totalFriendRefundedFromNotAllotted: 0,
    totalFriendInAllotted: 0,
    totalFriendProfit: 0,
    totalFriendLoss: 0,
    netFriendProfitLoss: 0,
    totalNetOwedToFriend: 0,
    liquidPayableNow: 0,
    unallocatedCashBalance: 0,
    myTotalInvested: 0,
    myNetProfitLoss: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("All");
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async (friend = selectedFriend) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (friend && friend !== "All") {
        params.friendName = friend;
      }
      const res = await api.get("/api/ipos/summary", { params });
      if (res.data.success) {
        setSummary(res.data.data.summary);
        setIpos(res.data.data.ipos || []);
        setCashTransactions(res.data.data.cashTransactions || []);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to fetch IPO data from server");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedFriend]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary();
    } else {
      setIpos([]);
      setCashTransactions([]);
    }
  }, [isAuthenticated, fetchSummary]);

  // Derive unique friends
  const friendsList = React.useMemo(() => {
    const names = new Set();
    ipos.forEach(i => {
      if (i.friendName) names.add(i.friendName);
    });
    cashTransactions.forEach(c => {
      if (c.friendName) names.add(c.friendName);
    });
    return Array.from(names);
  }, [ipos, cashTransactions]);

  const addIpo = async (ipoData) => {
    try {
      const res = await api.post("/api/ipos", ipoData);
      if (res.data.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const updateIpo = async (id, updates) => {
    try {
      const res = await api.put(`/api/ipos/${id}`, updates);
      if (res.data.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const deleteIpo = async (id) => {
    try {
      const res = await api.delete(`/api/ipos/${id}`);
      if (res.data.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const addCashTransaction = async (data) => {
    try {
      const res = await api.post("/api/cash", data);
      if (res.data.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const deleteCashTransaction = async (id) => {
    try {
      const res = await api.delete(`/api/cash/${id}`);
      if (res.data.success) {
        await fetchSummary();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  return (
    <IpoContext.Provider
      value={{
        summary,
        ipos,
        cashTransactions,
        loading,
        error,
        selectedFriend,
        setSelectedFriend,
        friendsList,
        fetchSummary,
        addIpo,
        updateIpo,
        deleteIpo,
        addCashTransaction,
        deleteCashTransaction
      }}
    >
      {children}
    </IpoContext.Provider>
  );
};

export const useIpo = () => {
  const context = useContext(IpoContext);
  if (!context) {
    throw new Error("useIpo must be used within an IpoProvider");
  }
  return context;
};

