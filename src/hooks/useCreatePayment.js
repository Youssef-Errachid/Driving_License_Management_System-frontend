import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import paymentService from "../api/services/paymentService";

export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => paymentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            toast.success("Paiement enregistré avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible d'enregistrer ce paiement.",
            );
        },
    });
}