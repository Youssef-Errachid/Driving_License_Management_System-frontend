import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import userService from "../api/userService";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role, userStatus }) => userService.update(id, { role, userStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur mis à jour avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de mettre à jour cet utilisateur.",
            );
        },
    });
}