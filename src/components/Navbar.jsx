import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaMoon, FaShoppingCart, FaSun, FaTimes } from "react-icons/fa";
import { useApp } from "../context/AppContext";

// Upgraded base link: Added active click scaling, smoother transitions, and flex gap centering
const baseLink =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, setUser, theme, setTheme } = useApp();
  const cartCount = Number(localStorage.getItem("cartCount") || 0);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-orange-600/95 via-orange-500/95 to-amber-500/95 backdrop-blur-md shadow-lg transition-colors duration-300 dark:border-gray-800 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand / Logo */}
          <Link to="/" className="group flex items-center gap-2 focus:outline-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-black text-orange-600 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-orange-500 dark:text-white">
              F
            </div>
            <span className="text-2xl font-black tracking-tight text-white transition-opacity group-hover:opacity-90">
              Foodie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-white text-orange-600 shadow-md dark:bg-orange-500 dark:text-white"
                    : "bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-white text-orange-600 shadow-md dark:bg-orange-500 dark:text-white"
                    : "bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700"
                }`
              }
            >
              <FaShoppingCart className="text-lg" />
              Cart
              <span
                className={`ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black shadow-inner transition-colors ${
                  // Logic to ensure the badge stands out regardless of active/dark state
                  "bg-orange-600 text-white dark:bg-white dark:text-orange-600"
                }`}
              >
                {cartCount}
              </span>
            </NavLink>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`${baseLink} bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700`}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-amber-100" />
              )}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* Auth Section */}
            <div className="ml-2 flex items-center gap-2 border-l border-white/20 pl-4 dark:border-gray-700">
              {user ? (
                <>
                  <span className="inline-flex cursor-default items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-inner dark:bg-gray-800/50">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`${baseLink} bg-white text-orange-600 hover:bg-orange-50 hover:shadow-md dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${baseLink} ${
                        isActive
                          ? "bg-white text-orange-600 shadow-md dark:bg-orange-500 dark:text-white"
                          : "bg-white/10 text-white hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `${baseLink} ${
                        isActive
                          ? "bg-white text-orange-600 shadow-md dark:bg-orange-500 dark:text-white"
                          : "bg-white border-2 border-transparent text-orange-600 hover:shadow-md dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <FaSun className="text-lg text-yellow-400" />
              ) : (
                <FaMoon className="text-lg text-amber-100" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {/* Smooth rotating cross-fade for hamburger menu */}
              <span className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}>
                <FaBars className="text-lg" />
              </span>
              <span className={`absolute transition-all duration-300 ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}>
                <FaTimes className="text-xl" />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mb-4 mt-2 flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/90">
              <NavLink
                to="/"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-white text-orange-600 shadow-sm dark:bg-orange-500 dark:text-white"
                      : "text-white hover:bg-white/20 dark:hover:bg-gray-700"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/cart"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-white text-orange-600 shadow-sm dark:bg-orange-500 dark:text-white"
                      : "text-white hover:bg-white/20 dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <FaShoppingCart /> Cart
                </span>
                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-orange-600 px-2 text-xs font-black text-white dark:bg-gray-600">
                  {cartCount}
                </span>
              </NavLink>

              <div className="my-1 h-px w-full bg-white/20 dark:bg-gray-700"></div>

              {user ? (
                <>
                  <span className="rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white dark:bg-gray-700/30">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 shadow-sm transition-all active:scale-95 dark:bg-gray-700 dark:text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-white text-orange-600 shadow-sm dark:bg-orange-500 dark:text-white"
                          : "text-white hover:bg-white/20 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-white text-orange-600 shadow-sm dark:bg-orange-500 dark:text-white"
                          : "bg-orange-700 text-white shadow-inner dark:bg-orange-600 dark:hover:bg-orange-500"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;