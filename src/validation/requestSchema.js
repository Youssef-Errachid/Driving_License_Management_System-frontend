import * as yup from "yup";

export const SERVICE_TYPES = [
    "NEW_LICENSE",
    "EXAM_RETAKE",
    "RENEWAL",
    "LOST_DUPLICATE",
    "DAMAGED_DUPLICATE",
    "UNBLOCKING",
    "INTERNATIONAL_LICENSE",
];

const requestSchema = yup.object({
    personId: yup
        .number()
        .typeError("La personne est obligatoire")
        .required("La personne est obligatoire"),

    serviceType: yup
        .string()
        .oneOf(SERVICE_TYPES, "Type de service invalide")
        .required("Le type de service est obligatoire"),

    licenseCategoryId: yup
        .number()
        .typeError("La catégorie de permis est obligatoire")
        .nullable()
        .when("serviceType", {
            is: "NEW_LICENSE",
            then: (schema) =>
                schema.required("La catégorie de permis est obligatoire pour un nouveau permis"),
            otherwise: (schema) => schema.nullable(),
        }),

    originalRequestId: yup
        .number()
        .typeError("La demande originale est obligatoire")
        .nullable()
        .when("serviceType", {
            is: "EXAM_RETAKE",
            then: (schema) =>
                schema.required("La demande originale est obligatoire pour une reprise d'examen"),
            otherwise: (schema) => schema.nullable(),
        }),

    licenseId: yup
        .number()
        .typeError("Le permis est obligatoire")
        .nullable()
        .when("serviceType", {
            is: (val) =>
                ["RENEWAL", "LOST_DUPLICATE", "DAMAGED_DUPLICATE", "UNBLOCKING", "INTERNATIONAL_LICENSE"].includes(val),
            then: (schema) => schema.required("Le permis est obligatoire pour ce type de service"),
            otherwise: (schema) => schema.nullable(),
        }),
});

export default requestSchema;