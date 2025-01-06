import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Sidebar from "./component/sidebar";
import Dashboard from "./Pages/Dashboard";
import Upload from "./Pages/Upload";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import UserManagement from "./Pages/UserManagement";

const useTokenRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("upsctoken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const tokenExp = decoded.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();

      if (currentTime >= tokenExp) {
        alert("Session has expired, Please login again.");
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      // Redirect logic based on user role
      const userRole = decoded.user.role;
      if (userRole === "admin" && location.pathname.startsWith("/admin")) {
        return; // Allow access to admin routes
      }
      if (
        userRole === "operator" &&
        location.pathname.startsWith("/operator")
      ) {
        return; // Allow access to operator routes
      }

      // Default redirection based on role
      navigate(userRole === "admin" ? "/admin/dashboard" : "/operator/upload", {
        replace: true,
      });
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);
};

function App() {
  useTokenRedirect();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/operator/upload" element={<Upload />} />
        <Route path="/admin/usermanagement" element={<UserManagement />} />
        {/* Catch-all route for invalid paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
