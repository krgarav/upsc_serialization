import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
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
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp * 1000; // Convert exp from seconds to milliseconds
        console.log(decoded);
        // Get the current time in milliseconds
        const currentTime = Date.now();
        if (currentTime >= tokenExp) {
          console.log("Token has expired");
          alert("Session has expired, Please login again.");
          localStorage.clear();
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 100);
        }

        if (decoded.user.role === "admin") {
          if (location.pathname === "/") {
            navigate("/admin/dashboard");
          } else {
            navigate(location.pathname);
          }
        } else {
          if (location.pathname === "/") {
            navigate("/operator/upload");
          } else {
            navigate(location.pathname);
          }
        }

        // if (location.pathname.includes("admin")) {
        //   navigate(location.pathname);
        // } else {
        //   navigate("/operator/upload", { replace: true });
        // }
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [location.pathname]);
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
        {/* <Route path="*" element={<Login />} /> */}
      </Routes>
    </>
  );
}

export default App;
