import * as yup from "yup";

export const PAYMENT_TYPES = [
    "APPLICATION_FEE",
    "VISION_EXAM",
    "THEORY_EXAM",
    "PRACTICAL_EXAM",
    "SERVICE",
    "FINE",
];

const paymentSchema = yup.object({
    requestId: yup
        .number()
        .typeError("La demande est obligatoire")
        .required("La demande est obligatoire"),

    paymentType: yup
        .string()
        .oneOf(PAYMENT_TYPES, "Type de paiement invalide")
        .required("Le type de paiement est obligatoire"),

    licenseBlockId: yup
        .number()
        .typeError("Le blocage concerné est obligatoire")
        .nullable()
        .when("paymentType", {
            is: "FINE",
            then: (schema) =>
                schema.required("Le blocage concerné est obligatoire pour une amende"),
            otherwise: (schema) => schema.nullable(),
        }),
});

export default paymentSchema;