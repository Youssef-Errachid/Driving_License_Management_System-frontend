import * as yup from "yup";

export const EXAM_TYPES = ["VISION", "THEORY", "PRACTICAL"];

const examSchema = yup.object({
    requestId: yup
        .number()
        .typeError("La demande est obligatoire")
        .required("La demande est obligatoire"),

    examType: yup
        .string()
        .oneOf(EXAM_TYPES, "Type d'examen invalide")
        .required("Le type d'examen est obligatoire"),

    appointmentDate: yup
        .date()
        .typeError("La date de rendez-vous est invalide")
        .required("La date de rendez-vous est obligatoire"),
});

export default examSchema;