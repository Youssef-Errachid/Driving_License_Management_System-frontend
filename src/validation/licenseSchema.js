import * as yup from "yup";

export const LICENSE_ISSUING_SERVICE_TYPES = [
    "NEW_LICENSE",
    "RENEWAL",
    "LOST_DUPLICATE",
    "DAMAGED_DUPLICATE",
];

const licenseSchema = yup.object({
    personId: yup
        .number()
        .typeError("La personne est obligatoire")
        .required("La personne est obligatoire"),

    requestId: yup
        .number()
        .typeError("La demande est obligatoire")
        .required("La demande est obligatoire"),

    conditions: yup
        .string()
        .trim()
        .nullable(),

    holderPhoto: yup
        .string()
        .trim()
        .nullable(),
});

export default licenseSchema;