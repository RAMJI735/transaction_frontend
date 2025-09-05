import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import TransactionProvider from './services/context/contextstate.jsx'




createRoot(document.getElementById('root')).render(
 <Auth0Provider
    domain="dev-z0k101s243kzty6i.us.auth0.com"
    clientId="Yo99rmxOYVzD27fxFak3hChtcj8n9IC0"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <TransactionProvider>
    <App />
    </TransactionProvider>
  </Auth0Provider>,

)
