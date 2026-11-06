import React from "react";
import { useAuth } from "./services/context/AuthContext";
import Dashboard from "./component/Dashboard";
import AuthView from "./component/AuthView";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold tracking-wide">
          Verifying secure session...
        </p>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <AuthView />}
    </>
  );
}

export default App;
