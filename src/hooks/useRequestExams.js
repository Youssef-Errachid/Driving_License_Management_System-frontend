import { useQuery } from "@tanstack/react-query";
import examService from "../api/services/examService";

export function useRequestExams(requestId) {
    return useQuery({
        queryKey: ["exams", "request", requestId],
        queryFn: async () => {
            const response = await examService.getByRequestId(requestId);
            return response.data.data;
        },
        enabled: Boolean(requestId),
    });
}