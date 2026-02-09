import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export default function LogoutButton(props: Props) {
  const { children } = props;
  const auth = useAuth();
  const logout = () => {
    void auth.removeUser();
  };
  return <Button onClick={logout}>{children}</Button>;
}
