import { useQuery } from "@tanstack/react-query";
import licenseCategoryService from "../api/licenseCategoryService";

export function useLicenseCategories() {
    return useQuery({
        queryKey: ["license-categories"],
        queryFn: async () => {
            const response = await licenseCategoryService.getAll();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 10,
    });
}