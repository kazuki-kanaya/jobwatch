import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "@/components/layouts/AppLayout";
import AuthCallbackPage from "@/features/auth/components/AuthCallbackPage";
import AuthGuard from "@/features/auth/components/AuthGuard";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
