import * as yup from "yup";

const examResultSchema = yup.object({
    result: yup
        .string()
        .oneOf(["PASSED", "FAILED"], "Résultat invalide")
        .required("Le résultat est obligatoire"),

    score: yup
        .number()
        .typeError("La note doit être un nombre")
        .min(0, "La note doit être positive")
        .max(40, "La note ne peut pas dépasser 40")
        .nullable(),
});

export default examResultSchema;