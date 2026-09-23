import { useQuery } from "@tanstack/react-query";
import userService from "../api/userService";

export function useUsers({ page = 0, size = 10 } = {}) {
    return useQuery({
        queryKey: ["users", "list", page, size],
        queryFn: async () => {
            const response = await userService.getAll(page, size);
            return response.data.data;
        },
        keepPreviousData: true,
    });
}