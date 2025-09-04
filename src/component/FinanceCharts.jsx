import React, { useState, useEffect, useCallback } from "react";
import { useTransactionContext } from "../services/context/contextstate";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function FinanceCharts() {
  const { getTransaction } = useTransactionContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTransaction = useCallback(async () => {
    try {
      // Check if token exists before making the request
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setError("No authentication token found");
        return;
      }

      setLoading(true);
      setError(null);
      const res = await getTransaction();
      
      // Safe unwrap
      const data = res?.data || [];
      setTransactions(Array.isArray(data) ? data : []);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message || "Failed to fetch transactions");
      setTransactions([]);
      
      // If it's an auth error, don't retry
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [getTransaction]);

  // Retry mechanism with exponential backoff
  const retryFetch = useCallback(() => {
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchTransaction();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s
    }
  }, [retryCount, fetchTransaction]);

  useEffect(() => {
    // Initial fetch
    fetchTransaction();
  }, [fetchTransaction]);

  // Watch for token changes and refetch data automatically
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && e.newValue) {
        // Token was added, refetch data automatically
        console.log("Token detected, auto-fetching data...");
        fetchTransaction();
      }
    };

    // Listen for storage events (when token is set from another tab/window)
    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for token availability and auto-fetch
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && transactions.length === 0 && !loading) {
        console.log("Token available but no data, auto-fetching...");
        fetchTransaction();
      }
    }, 1000); // Check every 1 second for faster response

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [fetchTransaction, transactions.length, loading]);

  // Process data for charts
  const processChartData = () => {
    const incomeData = {};
    const expenseData = {};

    transactions.forEach((transaction) => {
      if (transaction.category === "income") {
        // Income is credit
        incomeData[transaction.description] =
          (incomeData[transaction.description] || 0) + transaction.amount;
      } else {
        // Other categories are debit/expense
        expenseData[transaction.category] =
          (expenseData[transaction.category] || 0) + transaction.amount;
      }
    });

    return { incomeData, expenseData };
  };

  const { incomeData, expenseData } = processChartData();

  const totalIncome = Object.values(incomeData).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalExpense = Object.values(expenseData).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const netBalance = totalIncome - totalExpense;

  // Bar chart data
  const barChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount ($)",
        data: [totalIncome, totalExpense],
        backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.6)"],
        borderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)"],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart data
  const incomeChartData = {
    labels: Object.keys(incomeData),
    datasets: [
      {
        data: Object.values(incomeData),
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const expenseChartData = {
    labels: Object.keys(expenseData),
    datasets: [
      {
        data: Object.values(expenseData),
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(255,159,64,0.6)",
          "rgba(255,205,86,0.6)",
          "rgba(201,203,207,0.6)",
          "rgba(54,162,235,0.6)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(255,159,64,1)",
          "rgba(255,205,86,1)",
          "rgba(201,203,207,1)",
          "rgba(54,162,235,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: "Income vs Expenses",
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
          font: {
            size: 11
          }
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: {
            size: 9
          }
        }
      },
      title: {
        display: true,
        font: {
          size: 12
        }
      },
    },
    cutout: '60%',
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-center py-6">
          <div className="text-red-500 text-lg mb-3">⚠️ {error}</div>
          {retryCount < 3 && (
            <button
              onClick={retryFetch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
            >
              Retry ({3 - retryCount} attempts left)
            </button>
          )}
          {retryCount >= 3 && (
            <div className="text-gray-600 text-sm">
              <p>Maximum retry attempts reached.</p>
              <p>Please refresh the page or check your connection.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Financial Dashboard</h2>
      
      {/* Summary Cards - Smaller */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 p-3 rounded-lg border-l-3 border-green-400">
          <h3 className="text-sm font-semibold text-green-700">Income</h3>
          <p className="text-lg font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border-l-3 border-red-400">
          <h3 className="text-sm font-semibold text-red-700">Expenses</h3>
          <p className="text-lg font-bold text-red-600">
            ${totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border-l-3 border-blue-400">
          <h3 className="text-sm font-semibold text-blue-700">Net Balance</h3>
          <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Bar Chart - Smaller */}
      <div className="mb-6 h-64">
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Income and Expense Breakdown Charts - Smaller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Income Sources</h3>
          <div className="h-56">
            {Object.keys(incomeData).length > 0 ? (
              <Doughnut 
                data={incomeChartData} 
                options={{
                  ...doughnutOptions,
                  plugins: {title: {text: 'Income', font: {size: 12}}}
                }} 
              />
            ) : (
              <div className="text-center text-gray-500 text-sm py-6">No income data</div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Expense Categories</h3>
          <div className="h-56">
            {Object.keys(expenseData).length > 0 ? (
              <Doughnut 
                data={expenseChartData} 
                options={{
                  ...doughnutOptions,
                  plugins: {title: {text: 'Expenses', font: {size: 12}}}
                }} 
              />
            ) : (
              <div className="text-center text-gray-500 text-sm py-6">No expense data</div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Table - Smaller */}
      {/* <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Recent Transactions</h3>
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 border-b text-left text-xs">Category</th>
                <th className="px-3 py-2 border-b text-left text-xs">Description</th>
                <th className="px-3 py-2 border-b text-left text-xs">Amount</th>
                <th className="px-3 py-2 border-b text-left text-xs">Type</th>
                <th className="px-3 py-2 border-b text-left text-xs">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      transaction.category === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b text-xs">{transaction.description}</td>
                  <td className={`px-3 py-2 border-b font-medium text-xs ${
                    transaction.category === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${transaction.amount}
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      transaction.category === 'income' 
                        ? 'bg-green-200 text-green-700' 
                        : 'bg-red-200 text-red-700'
                    }`}>
                      {transaction.category === 'income' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b text-xs text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}

export default FinanceCharts;