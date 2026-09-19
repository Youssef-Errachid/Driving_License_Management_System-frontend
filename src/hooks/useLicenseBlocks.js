import { useQuery } from "@tanstack/react-query";
import licenseBlockService from "../api/services/licenseBlockService";

export function useLicenseBlocks(licenseId) {
    return useQuery({
        queryKey: ["license-blocks", licenseId],
        queryFn: async () => {
            const response = await licenseBlockService.getByLicenseId(licenseId);
            return response.data.data;
        },
        enabled: Boolean(licenseId),
    });
}