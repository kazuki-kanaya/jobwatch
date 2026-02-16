import { Toaster } from "@/components/ui/sonner";
import LocaleProvider from "@/i18n/LocaleProvider";
import AuthProvider from "./AuthProvider";
import QueryClientProvider from "./QueryClientProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocaleProvider>
        <QueryClientProvider>
          {children}
          <Toaster />
        </QueryClientProvider>
      </LocaleProvider>
    </AuthProvider>
  );
}
