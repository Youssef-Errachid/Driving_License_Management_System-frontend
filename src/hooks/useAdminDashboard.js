import { useQuery } from "@tanstack/react-query";
import dashboardService from "../api/services/dashboardService";

export function useAdminDashboard() {
    return useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: async () => {
            const response = await dashboardService.getAdminDashboard();
            return response.data.data;
        },
    });
}