import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import examTypeConfigService from "../api/services/examTypeConfigService";

export function useUpdateExamTypeConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, fee }) => examTypeConfigService.update(id, { fee }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exam-type-configs"] });
            toast.success("Frais mis à jour avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de mettre à jour les frais.",
            );
        },
    });
}