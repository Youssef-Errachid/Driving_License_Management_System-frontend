import * as yup from "yup";

const licenseBlockSchema = yup.object({
    licenseId: yup
        .number()
        .typeError("Le permis est obligatoire")
        .required("Le permis est obligatoire"),

    reason: yup
        .string()
        .trim()
        .required("Le motif est obligatoire"),

    fineAmount: yup
        .number()
        .typeError("Le montant de l'amende est obligatoire")
        .min(0, "Le montant de l'amende doit être positif")
        .required("Le montant de l'amende est obligatoire"),
});

export default licenseBlockSchema;