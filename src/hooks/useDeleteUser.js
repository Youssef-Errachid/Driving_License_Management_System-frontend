import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import userService from "../api/services/userService";

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => userService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur supprimé avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de supprimer cet utilisateur.",
            );
        },
    });
}