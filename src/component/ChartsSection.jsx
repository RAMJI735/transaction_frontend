import React from "react";
import { useIpo } from "../services/context/IpoContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { PieChart, BarChart3 } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const formatINR = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const ChartsSection = () => {
  const { summary, ipos } = useIpo();

  const {
    totalFriendCapitalApplied = 0,
    myTotalInvested = 0,
    totalFriendProfit = 0,
    totalFriendLoss = 0,
    myNetProfitLoss = 0
  } = summary;

  // Capital Distribution Doughnut
  const capitalData = {
    labels: ["Friend's Capital in IPOs", "My Wallet Capital in IPOs"],
    datasets: [
      {
        data: [
          Math.max(0, totalFriendCapitalApplied),
          Math.max(0, myTotalInvested)
        ],
        backgroundColor: ["#10b981", "#6366f1"],
        borderColor: ["#059669", "#4f46e5"],
        borderWidth: 1.5,
        hoverOffset: 6
      }
    ]
  };

  // IPO Performance Bars (Friend vs Self P&L for allotted IPOs)
  const allottedIpos = ipos.filter(i => i.status === "allotted" && i.sellAmount);
  
  const barLabels = allottedIpos.length > 0 
    ? allottedIpos.map(i => i.ipoName.length > 15 ? i.ipoName.substr(0, 15) + "..." : i.ipoName)
    : ["Tata Tech IPO (Demo)"];

  const friendPLData = allottedIpos.length > 0
    ? allottedIpos.map(i => Number(i.friendProfitLoss) || 0)
    : [10500];

  const myPLData = allottedIpos.length > 0
    ? allottedIpos.map(i => Number(i.myProfitLoss) || 0)
    : [0];

  const performanceData = {
    labels: barLabels,
    datasets: [
      {
        label: "Friend's Profit / Loss (₹)",
        data: friendPLData,
        backgroundColor: "#10b981",
        borderRadius: 8
      },
      {
        label: "My Profit / Loss (₹)",
        data: myPLData,
        backgroundColor: "#6366f1",
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 11, weight: "bold" },
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatINR(context.raw)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 10 }
        }
      },
      x: {
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 11, weight: "bold" },
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.label}: ${formatINR(context.raw)}`
        }
      }
    },
    cutout: "65%"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Capital Split Doughnut */}
      <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-800">Capital Sourcing Split</h4>
          </div>
          <p className="text-xs text-slate-500">
            Ratio of friend's pooled money vs your personal wallet funds in active IPOs
          </p>
        </div>

        <div className="h-56 my-4 relative flex items-center justify-center">
          <Doughnut data={capitalData} options={doughnutOptions} />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-xs text-center">
          <div>
            <span className="text-slate-400 block text-[11px]">Friend Capital</span>
            <span className="font-bold text-emerald-600">{formatINR(totalFriendCapitalApplied)}</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 block text-[11px]">My Wallet Capital</span>
            <span className="font-bold text-indigo-600">{formatINR(myTotalInvested)}</span>
          </div>
        </div>
      </div>

      {/* P&L Distribution Bar Chart */}
      <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-800">IPO Profit / Loss Split</h4>
          </div>
          <p className="text-xs text-slate-500">
            Realized listing gains split between friend and you for each completed IPO
          </p>
        </div>

        <div className="h-56 my-4">
          <Bar data={performanceData} options={barOptions} />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Friend's Net IPO Gains: <strong className="text-emerald-600 font-bold">+{formatINR(totalFriendProfit - totalFriendLoss)}</strong></span>
          <span>Your Net Gains: <strong className="text-indigo-600 font-bold">+{formatINR(myNetProfitLoss)}</strong></span>
        </div>
      </div>

    </div>
  );
};

export default ChartsSection;

