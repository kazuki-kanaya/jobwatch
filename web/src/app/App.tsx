import AppRouter from "@/app/router";
import AppProvider from "./providers/AppProvider";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
