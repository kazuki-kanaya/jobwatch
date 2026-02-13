import AuthProvider from "@/app/providers/AuthProvider";
import AppRouter from "@/app/router";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
