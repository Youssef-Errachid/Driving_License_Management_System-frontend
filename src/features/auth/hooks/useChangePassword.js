import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import userService from "../../users/api/userService";

export function useChangePassword() {
    return useMutation({
        mutationFn: ({ currentPassword, newPassword }) =>
            userService.changePassword({ currentPassword, newPassword }),
        onSuccess: () => {
            toast.success("Mot de passe mis à jour avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de mettre à jour le mot de passe.",
            );
        },
    });
}