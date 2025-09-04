import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";
import FinanceCharts from "./FinanceCharts";
import TransactionTable from "./TransactionTable";

const Dashboard = () => {
  const { logout } = useAuth0();

  const logoutfun = () => {
    logout();
    localStorage.removeItem("token");
  };



  return (
    <div >
      <Navbar onLogout={logoutfun} />
     
      <FinanceCharts/>
      <TransactionTable/>


    </div>
  );
};

export default Dashboard;
