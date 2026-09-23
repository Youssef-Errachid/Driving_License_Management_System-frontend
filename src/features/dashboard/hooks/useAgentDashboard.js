import { useQuery } from "@tanstack/react-query";
import dashboardService from "../api/dashboardService";

export function useAgentDashboard() {
    return useQuery({
        queryKey: ["agent-dashboard"],
        queryFn: async () => {
            const response = await dashboardService.getAgentDashboard();
            return response.data.data;
        },
    });
}