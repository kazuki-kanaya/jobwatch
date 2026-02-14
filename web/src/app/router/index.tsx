import { BrowserRouter, Route, Routes } from "react-router";
import AuthGuard from "@/features/auth/components/AuthGuard";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<>hoge</>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
