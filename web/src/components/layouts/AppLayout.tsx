import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LoginButton from "@/features/auth/components/LoginButton";
import LogoutButton from "@/features/auth/components/LogoutButton";

function AppSidebar() {
  const auth = useAuth();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <LoginButton>Login</LoginButton>
        </SidebarGroup>
        <SidebarGroup>
          <LogoutButton>Logout</LogoutButton>
        </SidebarGroup>
        <SidebarGroup>
          <Button onClick={() => console.log(auth)}>Auth</Button>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

type Props = {
  children: React.ReactNode;
};

export default function AppLayout(props: Props) {
  const { children } = props;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
