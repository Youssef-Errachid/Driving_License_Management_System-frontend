import { useQuery } from "@tanstack/react-query";
import personService from "../api/services/personService";

export function usePersons({ page = 0, size = 10, query = "" }) {
    const isSearch = query.trim().length > 0;

    return useQuery({
        queryKey: isSearch ? ["persons", "search", query] : ["persons", "list", page, size],
        queryFn: async () => {
            if (isSearch) {
                const response = await personService.search(query.trim());
                return { content: response.data.data, page: 0, totalPages: 1, totalElements: response.data.data.length };
            }
            const response = await personService.getAll(page, size);
            return response.data.data;
        },
        keepPreviousData: true,
    });
}