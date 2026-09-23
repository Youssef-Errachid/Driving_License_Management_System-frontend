import { useQuery } from "@tanstack/react-query";
import examTypeConfigService from "../api/examTypeConfigService";

export function useExamTypeConfigs() {
    return useQuery({
        queryKey: ["exam-type-configs"],
        queryFn: async () => {
            const response = await examTypeConfigService.getAll();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 10,
    });
}