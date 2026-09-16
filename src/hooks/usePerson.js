import { useQuery } from "@tanstack/react-query";
import personService from "../api/services/personService";

export function usePerson(id, options = {}) {
    return useQuery({
        queryKey: ["persons", "detail", id],
        queryFn: async () => {
            const response = await personService.getById(id);
            return response.data.data;
        },
        enabled: Boolean(id) && (options.enabled ?? true),
        ...options,
    });
}