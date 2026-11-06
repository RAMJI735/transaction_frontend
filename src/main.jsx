import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./services/context/AuthContext.jsx";
import { IpoProvider } from "./services/context/IpoContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <IpoProvider>
        <App />
      </IpoProvider>
    </AuthProvider>
  </StrictMode>
);
