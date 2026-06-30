import { useAuth0 } from "@auth0/auth0-react";
import { useQueryClient } from "@tanstack/react-query";
import { postLogout } from "../api";

export const useLogout = () => {
  const { logout } = useAuth0();
  const queryClient = useQueryClient();

  const handleLogout = (): void => {
    void postLogout().finally(() => {
      localStorage.removeItem("access_token");
      queryClient.clear();
      void logout({ logoutParams: { returnTo: window.location.origin + "/login" } });
    });
  };

  return { logout: handleLogout };
};
