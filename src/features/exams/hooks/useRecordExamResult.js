import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import examService from "../api/examService";

export function useRecordExamResult(requestId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => examService.recordResult(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exams", "request", requestId] });
            toast.success("Résultat enregistré avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible d'enregistrer ce résultat.",
            );
        },
    });
}