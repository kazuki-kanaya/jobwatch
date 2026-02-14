import AuthProvider from "./AuthProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
