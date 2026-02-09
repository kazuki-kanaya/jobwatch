import { AuthProvider } from "react-oidc-context";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthGuard from "@/features/auth/components/AuthGuard";
import { oidcConfig } from "@/features/auth/dependencies";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import AppLayout from "./components/layouts/AppLayout";
import AuthCallbackPage from "./pages/AuthCallbackPage";

export default function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route element={<AuthGuard />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
