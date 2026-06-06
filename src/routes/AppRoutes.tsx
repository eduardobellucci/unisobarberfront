import { Route, Routes, Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { AdminNav } from "../components/AdminNav";
import HomePage from "../pages/HomePage";
import BarbersPage from "../pages/BarbersPage";
import BarberProfilePage from "../pages/BarberProfilePage";
import AppointmentsPage from "../pages/AppointmentsPage";
import AccountPage from "../pages/AccountPage";
import LoginBarberPage from "../pages/LoginBarberPage";
import DashboardPage from "../pages/DashboardPage";
import ManageBarbersPage from "../pages/ManageBarbersPage";
import ManageServicesPage from "../pages/ManageServicesPage";
import ManageSchedulesPage from "../pages/ManageSchedulesPage";
import ManageAppointmentsPage from "../pages/ManageAppointmentsPage";
import CustomizeAppPage from "../pages/CustomizeAppPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";

function ClientLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/barbeiros" element={<BarbersPage />} />
        <Route path="/barbeiros/:id" element={<BarberProfilePage />} />
        <Route path="/agendamentos" element={<AppointmentsPage />} />
        <Route path="/conta" element={<AccountPage />} />
      </Route>

      <Route path="/login-barbeiro" element={<LoginBarberPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/painel" element={<DashboardPage />} />
        <Route path="/painel/barbeiros" element={<ManageBarbersPage />} />
        <Route path="/painel/servicos" element={<ManageServicesPage />} />
        <Route path="/painel/horarios" element={<ManageSchedulesPage />} />
        <Route path="/painel/agendamentos" element={<ManageAppointmentsPage />} />
        <Route path="/painel/personalizacao" element={<CustomizeAppPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

