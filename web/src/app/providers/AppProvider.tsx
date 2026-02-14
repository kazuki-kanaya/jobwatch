import AuthProvider from "./AuthProvider";
import QueryClientProvider from "./QueryClientProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
