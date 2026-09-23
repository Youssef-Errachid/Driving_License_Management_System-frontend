import { useQuery } from "@tanstack/react-query";
import driverService from "../api/services/driverService";
import licenseService from "../api/services/licenseService";

export function usePersonLicenses(nationalNumber) {
    return useQuery({
        queryKey: ["person-licenses", nationalNumber],
        queryFn: async () => {
            const driverResponse = await driverService.search({ nationalNumber });
            const driver = driverResponse.data.data;

            const licensesResponse = await licenseService.getByDriverId(driver.id);
            return licensesResponse.data.data;
        },
        enabled: Boolean(nationalNumber),
        retry: false,
    });
}