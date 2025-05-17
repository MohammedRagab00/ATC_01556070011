import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import EventManagement from "./EventManagement";
import UserManagement from "./UserManagement";
import AdminNav from "../../components/admin/AdminNav";

// Admin layout component that wraps all admin pages
const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNav />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

// Admin routes entry point
const AdminRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setIsAdmin(user && user.isAdmin === true);
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not admin
  if (!isAdmin) {
    return (
      <Navigate to="/login" state={{ message: "Admin access required" }} />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/events"
        element={
          <AdminLayout>
            <EventManagement />
          </AdminLayout>
        }
      />
      <Route
        path="/users"
        element={
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        }
      />
      {/* Add more admin routes as needed */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
