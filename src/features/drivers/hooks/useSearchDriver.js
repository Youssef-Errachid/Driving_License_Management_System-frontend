import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import driverService from "../api/driverService";

export function useSearchDriver() {
    return useMutation({
        mutationFn: ({ nationalNumber, licenseNumber }) =>
            driverService.search({ nationalNumber, licenseNumber }),
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Aucun conducteur trouvé.",
            );
        },
    });
}