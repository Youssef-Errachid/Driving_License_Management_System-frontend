import { useQuery } from "@tanstack/react-query";
import examService from "../api/services/examService";

export function useExams({ appointmentDate, examType, pendingOnly = false, page = 0, size = 10 } = {}) {
    return useQuery({
        queryKey: ["exams", "list", { appointmentDate, examType, pendingOnly, page, size }],
        queryFn: async () => {
            const response = await examService.getAll({ appointmentDate, examType, pendingOnly, page, size });
            return response.data.data;
        },
        keepPreviousData: true,
    });
}