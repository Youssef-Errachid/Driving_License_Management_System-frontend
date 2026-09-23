import { useQuery } from "@tanstack/react-query";
import licenseService from "../api/licenseService";

export function useLicenses({
                                blockingStatus,
                                issueReason,
                                query,
                                page = 0,
                                size = 10,
                                enabled = true,
                            } = {}) {
    return useQuery({
        queryKey: ["licenses", "list", { blockingStatus, issueReason, query, page, size }],
        queryFn: async () => {
            const response = await licenseService.getAll({
                blockingStatus,
                issueReason,
                query,
                page,
                size,
            });
            return response.data.data;
        },
        keepPreviousData: true,
        enabled,
    });
}