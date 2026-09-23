import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import userService from "../api/userService";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => userService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur créé avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de créer cet utilisateur.",
            );
        },
    });
}