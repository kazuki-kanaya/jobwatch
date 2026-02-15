// Responsibility: Compose global providers required by the application.

import LocaleProvider from "@/i18n/LocaleProvider";
import AuthProvider from "./AuthProvider";
import QueryClientProvider from "./QueryClientProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
