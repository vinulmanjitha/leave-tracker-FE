import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import LeaveRequestPage from "../pages/LeaveRequestPage";
import ManagerPage from "../pages/ManagerPage";
import LoginPage from "../pages/LoginPage"; 

const ProtectedRoute = ({ element, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return element;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/leave-request"
        element={<ProtectedRoute role="EMPLOYEE" element={<LeaveRequestPage />} />}
      />

      <Route
        path="/manager"
        element={<ProtectedRoute role="ADMIN" element={<ManagerPage />} />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
