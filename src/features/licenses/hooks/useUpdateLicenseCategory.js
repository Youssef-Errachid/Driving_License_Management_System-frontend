import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import licenseCategoryService from "../api/licenseCategoryService";

export function useUpdateLicenseCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, minimumAge, validationDurationYears, fee }) =>
            licenseCategoryService.update(id, { minimumAge, validationDurationYears, fee }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["license-categories"] });
            toast.success("Catégorie mise à jour avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de mettre à jour la catégorie.",
            );
        },
    });
}