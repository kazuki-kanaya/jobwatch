import { useAuth } from "react-oidc-context";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { storageKeys } from "@/features/auth/constants";

type Props = {
  children: React.ReactNode;
};

export default function LoginButton(props: Props) {
  const { children } = props;
  const location = useLocation();
  const auth = useAuth();
  const login = () => {
    sessionStorage.setItem(storageKeys.redirectAfterLoginKey, location.pathname + location.search);
    void auth.signinRedirect();
  };
  return <Button onClick={login}>{children}</Button>;
}
