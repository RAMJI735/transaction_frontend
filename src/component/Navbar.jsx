import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useTransactionContext } from '../services/context/contextstate'

const Navbar = ({ onLogout }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };




  const { user, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [havetoken, sethavetoken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useTransactionContext();

  
  const createToken = async () => {
    try {
      const res = await getToken({ name: user?.name, sub: user?.sub, picture: user?.picture, email: user?.email });
      console.log(res);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        sethavetoken(res.token);
      }
    } catch (error) {
      console.error('Error creating token:', error);
    }
  }

  const tokn = () => {
    const token = localStorage.getItem("token");
    sethavetoken(token);
    setIsLoading(false);
  }

  useEffect(() => {
    tokn();
  }, []);

  useEffect(() => {
    if (user) {
      createToken();
    }
  }, [user]);

  console.log(havetoken, "ss")
  
  // Show loading spinner while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppBar position="static" className="bg-blue-600 shadow-md" style={{background:"rgb(132, 220, 198)"}}>
      <Toolbar className="flex justify-between">
        {/* Left Section (Logo + Name) */}
        <div className="flex items-center space-x-2">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon className="text-white" />
          </IconButton>
          <span className="text-white font-bold text-lg">My Dashboard</span>
        </div>

        {/* Right Section (User + Logout) */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <Avatar
                src={user?.picture}
                alt={user?.name}
                className="w-8 h-8"
              />
              <span className="mx-2 sm:inline text-white font-medium">
                {user?.name}
              </span>
            </div>
          )}

          {havetoken && (
          <Button
            variant="outlined"
            onClick={onLogout}
            className="hidden sm:inline text-white border-white hover:bg-white hover:text-blue-600"
          >
            Logout
          </Button>
          )}

          {!havetoken && (

          <Button 
                variant='contained'
                onClick={e => loginWithRedirect()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Button>
          )}
          {/* Mobile Menu */}
          <div className="sm:hidden">
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon className="text-white" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
