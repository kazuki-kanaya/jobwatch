import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthGuard } from "@/features/auth";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import DashboardPage from "@/pages/DashboardPage";
import InvitationAcceptPage from "@/pages/InvitationAcceptPage";
import NewWorkspacePage from "@/pages/NewWorkspacePage";
import NotFoundPage from "@/pages/NotFoundPage";
import AppProvider from "@/providers/AppProvider";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/new/workspace" element={<NewWorkspacePage />} />
            <Route path="/invite" element={<InvitationAcceptPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
