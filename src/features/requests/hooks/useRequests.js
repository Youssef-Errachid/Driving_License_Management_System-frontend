import { useQuery } from "@tanstack/react-query";
import requestService from "../api/requestService";

export function useRequests({ status, serviceType, nationalNumber, page = 0, size = 10, enabled = true } = {}) {
    return useQuery({
        queryKey: ["requests", "list", { status, serviceType, nationalNumber, page, size }],
        queryFn: async () => {
            const response = await requestService.getAll({ status, serviceType, nationalNumber, page, size });
            return response.data.data;
        },
        keepPreviousData: true,
        enabled,
    });
}