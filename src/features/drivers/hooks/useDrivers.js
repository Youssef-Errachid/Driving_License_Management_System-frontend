import { useQuery } from "@tanstack/react-query";
import driverService from "../api/driverService";

export function useDrivers({ page = 0, size = 10 } = {}) {
    return useQuery({
        queryKey: ["drivers", "list", page, size],
        queryFn: async () => {
            const response = await driverService.getAll(page, size);
            return response.data.data;
        },
        keepPreviousData: true,
    });
}