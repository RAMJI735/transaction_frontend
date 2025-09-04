
import { useEffect, useState } from 'react'
import './App.css'
import { useAuth0 } from '@auth0/auth0-react'
import Dashboard from './component/Dashboard'
import { Button } from '@mui/material'
import { useTransactionContext } from './services/context/contextstate'

function App() {
  const { user, loginWithRedirect, getAccessTokenSilently, logout } = useAuth0();
  // const [havetoken, sethavetoken] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  // const { getToken } = useTransactionContext();

  // const createToken = async () => {
  //   try {
  //     const res = await getToken({ name: user?.name, sub: user?.sub, picture: user?.picture, email: user?.email });
  //     console.log(res);
  //     if (res?.token) {
  //       localStorage.setItem("token", res.token);
  //       sethavetoken(res.token);
  //     }
  //   } catch (error) {
  //     console.error('Error creating token:', error);
  //   }
  // }

  // const tokn = () => {
  //   const token = localStorage.getItem("token");
  //   sethavetoken(token);
  //   setIsLoading(false);
  // }

  // useEffect(() => {
  //   tokn();
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     createToken();
  //   }
  // }, [user]);

  // console.log(havetoken, "ss")
  
  // // Show loading spinner while checking token
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }
  
  return (
    <>
       
        <Dashboard user={user} />
            
      {/* {!havetoken && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Welcome to Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to access your dashboard
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <Button 
                variant='contained'
                onClick={e => loginWithRedirect()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}

export default App
