import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AIAnalysis from "../pages/ai/AIAnalysis";
import Assessment from "../pages/assessments/Assessment";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Certificates from "../pages/certificates/Certificates";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadDocument from "../pages/documents/UploadDocument";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Projects from "../pages/projects/Projects";
import Reports from "../pages/reports/Reports";
import VerifyCertificate from "../pages/verification/VerifyCertificate";
import { useAuthStore } from "../store/authStore";

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/documents" element={<UploadDocument />} />
            <Route path="/assessments" element={<Assessment />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
