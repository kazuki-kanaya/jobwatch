import { BrowserRouter, Route, Routes } from "react-router";
import AuthGuard from "@/features/auth/components/AuthGuard";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import DashboardPage from "@/pages/DashboardPage";
import InvitationAcceptPage from "@/pages/InvitationAcceptPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/invite" element={<InvitationAcceptPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
