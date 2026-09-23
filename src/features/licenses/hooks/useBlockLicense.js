import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import licenseBlockService from "../api/licenseBlockService";

export function useBlockLicense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => licenseBlockService.block(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["licenses"] });
            queryClient.invalidateQueries({ queryKey: ["license-blocks"] });
            toast.success("Permis bloqué avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de bloquer ce permis.",
            );
        },
    });
}