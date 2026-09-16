import { useQuery } from "@tanstack/react-query";
import requestService from "../api/services/requestService";

export function useRequests({ status, serviceType, nationalNumber, page = 0, size = 10 } = {}) {
    return useQuery({
        queryKey: ["requests", "list", { status, serviceType, nationalNumber, page, size }],
        queryFn: async () => {
            const response = await requestService.getAll({ status, serviceType, nationalNumber, page, size });
            return response.data.data;
        },
        keepPreviousData: true,
    });
}