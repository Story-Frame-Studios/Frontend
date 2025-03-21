// components/Navbar.jsx
import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/LoginContext';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const Navbar = () => {
  const { loginData, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // TODO: make JWT call to backend to logout if needed
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">JobPortal</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {/* <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                Home
              </Link> */}

              {loginData?.token ? (
                <>

{loginData.user.role==='employer'?   <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>:null}
                  {loginData.user?.role === 'candidate' && (
                    <>
                      <Link to="/job-opportunities" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                        Job Opportunities
                      </Link>
                      <Link to="/myApplications" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                        My Applications
                      </Link>
                    </>
                  )}

                  {loginData.user?.role === 'employer' && (
                    <Link to="/jobs" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
                      Jobs
                    </Link>
                  )}

                  <div className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger><div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white font-semibold">
                        {loginData.user?.firstName?.charAt(0).toUpperCase()}
                      </div></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link to="/account-settings"  >
                            Account Settings
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Link onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}>
                            Logout
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>

                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="blue">
                    <Link to="/login" >
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="blueOutline">
                    <Link to="/signup">
                      Sign Up
                    </Link>
                  </Button>


                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden transition-all duration-300 ease-in-out">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                Home
              </Link>

              {loginData?.token ? (
                <>
               {loginData.user.role==='employer'?   <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>:null}
                  <Link
                    to="/account-settings"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Account Settings
                  </Link>
                  <div className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger>Profile</DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>

                  <div className="px-3 py-2">
                    <span className="block text-gray-700 mb-2">
                      {loginData.user?.firstName} {loginData.user?.lastName}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 px-3 py-2">

                  <Link
                    to="/login"
                    className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-center"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-500 text-center"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
    </>
  );
};