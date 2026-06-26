import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "../components/common/ProtectedRoute";

import AdminLayout from "../components/admin/AdminLayout";
import CustomerLayout from "../components/customer/CustomerLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Rooms from "../pages/admin/Rooms";
import Bookings from "../pages/admin/Bookings";
import Guests from "../pages/admin/Guests";
import Payments from "../pages/admin/Payments";
import Housekeeping from "../pages/admin/Housekeeping";
import Staff from "../pages/admin/Staff";
import Restaurant from "../pages/admin/Restaurant";
import Reports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";
import AdminInvoices from "../pages/admin/AdminInvoices";
import CustomerRequestsAdmin from "../pages/admin/CustomerRequestsAdmin";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerRooms from "../pages/customer/CustomerRooms";
import CustomerBookings from "../pages/customer/CustomerBookings";
import CustomerPayments from "../pages/customer/CustomerPayments";
import CustomerFood from "../pages/customer/CustomerFood";
import CustomerRequests from "../pages/customer/CustomerRequests";
import CustomerProfile from "../pages/customer/CustomerProfile";
import CustomerNotifications from "../pages/customer/CustomerNotifications";
import CustomerSupport from "../pages/customer/CustomerSupport";
import CustomerInvoices from "../pages/customer/CustomerInvoices";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="guests" element={<Guests />} />
        <Route path="payments" element={<Payments />} />
        <Route path="housekeeping" element={<Housekeeping />} />
        <Route path="customer-requests" element={<CustomerRequestsAdmin />} />
        <Route path="staff" element={<Staff />} />
        <Route path="restaurant" element={<Restaurant />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="invoices" element={<AdminInvoices />} />
        
      </Route>

      <Route
        path="/customer"
        element={
          <ProtectedRoute role="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="rooms" element={<CustomerRooms />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="food" element={<CustomerFood />} />
        <Route path="requests" element={<CustomerRequests />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        
      </Route>
    </Routes>
  );
}

export default AppRoutes;