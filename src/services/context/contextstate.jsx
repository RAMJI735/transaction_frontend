import axios from "axios";
import { createContext, useContext, useState } from "react";
import dotenv from "dotenv"
dotenv.config();

// Create the context
const TransactionContext = createContext();

// Provider component
const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);


  const getToken = async (data) => {
    console.log(data)
    try {
      const headers = {
        "Content-Type": "application/json",
      }
      const response = await axios.post(`${process.env.SERVER}/auth/google`, data, { headers });
      return response.data;
      
    } catch (error) {
      console.error("Error in getToken:", error);
      return error;
    }
  }


    const addTransaction = async (description) => {
    try {
      const token= localStorage.getItem("token");
      const havetoken = token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${havetoken}`
      }
      const response = await axios.post("addTransaction", description, { headers });
      return response.data;
      
    } catch (error) {
      console.error("Error in getToken:", error);
      return error;
    }
  }

  const getTransaction = async () => {
    try {
      const token= localStorage.getItem("token");
      const havetoken = token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${havetoken}`
      }
      const response = await axios.get(`${process.env.SERVER}/getTransaction`,  { headers });
      return response.data;
      
    } catch (error) {
      console.error("Error in getToken:", error);
      return error;
    }
  }
  const updateTransaction = async (data) => {
    try {
      const token= localStorage.getItem("token");
      const havetoken = token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${havetoken}`
      }
      const response = await axios.put(`${process.env.SERVER}/updateTransaction`, data, { headers });
      return response.data;
      
    } catch (error) {
      console.error("Error in getToken:", error);
      return error;
    }
  }
  const deleteTransaction = async (id) => {
    try {
      const token= localStorage.getItem("token");
      const havetoken = token;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${havetoken}`
      }
      const response = await axios.delete(`${process.env.SERVER}/${id}`, { headers });
      return response.data;
      
    } catch (error) {
      console.error("Error in getToken:", error);
      return error;
    }
  }



  const value = {
    getToken,
    transactions,
    setTransactions,
    loading,
    setLoading,
    addTransaction,
    getTransaction,
    deleteTransaction,
    updateTransaction
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the context
const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

export { TransactionProvider, useTransactionContext };
export default TransactionProvider;


