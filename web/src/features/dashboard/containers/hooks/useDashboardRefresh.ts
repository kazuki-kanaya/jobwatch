import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type UseDashboardRefreshParams = {
  successMessage: string;
  errorMessage: string;
};

type UseDashboardRefreshResult = {
  isRefreshing: boolean;
  refreshDashboard: () => Promise<void>;
};

export const useDashboardRefresh = ({
  successMessage,
  errorMessage,
}: UseDashboardRefreshParams): UseDashboardRefreshResult => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDashboard = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.refetchQueries({ queryKey: ["dashboard"], type: "active" });
      toast.success(successMessage);
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    refreshDashboard,
  };
};
