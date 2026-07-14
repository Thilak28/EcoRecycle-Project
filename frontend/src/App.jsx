import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePickup from "./pages/CreatePickup";
import MyPickups from "./pages/MyPickups";
import RewardHistory from "./pages/RewardHistory";
import AgencyDashboard from "./pages/AgencyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/user/create-pickup" element={<ProtectedRoute allowedRoles={["user"]}><CreatePickup /></ProtectedRoute>} />
          <Route path="/user/my-pickups" element={<ProtectedRoute allowedRoles={["user"]}><MyPickups /></ProtectedRoute>} />
          <Route path="/user/reward-history" element={<ProtectedRoute allowedRoles={["user"]}><RewardHistory /></ProtectedRoute>} />

          <Route path="/agency/dashboard" element={<ProtectedRoute allowedRoles={["agency"]}><AgencyDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;