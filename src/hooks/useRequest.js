import { useQuery } from "@tanstack/react-query";
import requestService from "../api/services/requestService";

export function useRequest(id, options = {}) {
    return useQuery({
        queryKey: ["requests", "detail", id],
        queryFn: async () => {
            const response = await requestService.getById(id);
            return response.data.data;
        },
        enabled: Boolean(id) && (options.enabled ?? true),
        ...options,
    });
}