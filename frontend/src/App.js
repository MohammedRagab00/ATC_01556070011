import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import ActivateAccount from "./pages/ActivateAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import EventList from "./components/admin/EventList";
import UserManagement from "./pages/admin/UserManagement";
import Dashboard from "./pages/admin/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import AdminNav from "./components/admin/AdminNav";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import  { createGlobalStyle } from 'styled-components';
import Congratulations from './components/Congratulations';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    min-height: 100vh;
  }
`;

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Redirect admin users to admin dashboard if they try to access home
  if (isAdmin && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && <AdminNav />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/activate-account" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/congratulations" element={<Congratulations eventName="" />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requireAdmin>
              <EventList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <CustomThemeProvider>
      <GlobalStyle />
      <Router>
        <SidebarProvider>
          <AppRoutes />
        </SidebarProvider>
      </Router>
    </CustomThemeProvider>
  );
};

export default App;
