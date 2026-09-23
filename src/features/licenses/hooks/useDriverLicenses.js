import { useQuery } from "@tanstack/react-query";
import licenseService from "../api/licenseService";

export function useDriverLicenses(driverId) {
    return useQuery({
        queryKey: ["licenses", "driver", driverId],
        queryFn: async () => {
            const response = await licenseService.getByDriverId(driverId);
            return response.data.data;
        },
        enabled: Boolean(driverId),
    });
}