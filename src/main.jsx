import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import TransactionProvider from './services/context/contextstate.jsx'
import dotenv from "dotenv"
dotenv.config();

createRoot(document.getElementById('root')).render(
 <Auth0Provider
    domain={process.env.auth-domain}
    clientId={process.env.auth_client}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <TransactionProvider>
    <App />
    </TransactionProvider>
  </Auth0Provider>,

)
