import { useQuery } from "@tanstack/react-query";
import licenseService from "../api/services/licenseService";

export function useLicense(id, options = {}) {
    return useQuery({
        queryKey: ["licenses", "detail", id],
        queryFn: async () => {
            const response = await licenseService.getById(id);
            return response.data.data;
        },
        enabled: Boolean(id) && (options.enabled ?? true),
        ...options,
    });
}