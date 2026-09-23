import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import examService from "../api/examService";

export function useScheduleExam(requestId) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => examService.schedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exams", "request", requestId] });
            toast.success("Examen planifié avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible de planifier cet examen.",
            );
        },
    });
}