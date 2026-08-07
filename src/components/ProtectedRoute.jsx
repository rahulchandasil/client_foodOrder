import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
