import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBars, FaMoon, FaShoppingCart, FaSun, FaTimes } from "react-icons/fa";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { Badge } from "./ui/Badge";
import { Container } from "./ui/Container";

const fetchCartData = async () => {
  const response = await api.get(`/cart`);
  return response.data.cart || { items: [] };
};

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, setUser, theme, setTheme } = useApp();
  const queryClient = useQueryClient();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData,
    enabled: !!user,
  });

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    queryClient.clear();
    setOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand / Logo */}
          <Link to="/" className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground shadow-sm">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Foodie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <FaShoppingCart className="text-lg" />
              Cart
              {user && (
                <Badge variant="primary" className="ml-1 px-1.5 py-0 min-w-[20px] h-5 rounded-full">
                  {cartCount}
                </Badge>
              )}
            </NavLink>

            {/* Theme Toggle Button */}
            <IconButton
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </IconButton>

            {/* Auth Section */}
            <div className="ml-2 flex items-center gap-3 border-l border-border pl-5">
              {user ? (
                <>
                  <span className="text-sm font-medium text-foreground">
                    Hi, {user.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <IconButton
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </IconButton>
            <IconButton
              variant="ghost"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="text-foreground"
            >
              {open ? <FaTimes /> : <FaBars />}
            </IconButton>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mb-4 mt-2 flex flex-col gap-1 rounded-xl border border-border bg-surface p-2 shadow-lg">
              <NavLink
                to="/"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-muted text-primary"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/cart"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-muted text-primary"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <FaShoppingCart /> Cart
                </span>
                {user && (
                  <Badge variant="primary" className="px-1.5 py-0 min-w-[20px] h-5 rounded-full">
                    {cartCount}
                  </Badge>
                )}
              </NavLink>

              <div className="my-2 h-px w-full bg-border"></div>

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                    Logged in as {user.name}
                  </div>
                  <Button
                    variant="danger"
                    className="w-full justify-start rounded-lg px-4 py-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <Button variant="outline" className="w-full" onClick={() => { closeMobile(); navigate("/login"); }}>
                    Login
                  </Button>
                  <Button variant="primary" className="w-full" onClick={() => { closeMobile(); navigate("/register"); }}>
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;