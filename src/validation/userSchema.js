import * as yup from "yup";

export const ROLES = ["ADMIN", "AGENT"];

const userSchema = yup.object({
    personId: yup
        .number()
        .typeError("La personne est obligatoire")
        .required("La personne est obligatoire"),

    email: yup
        .string()
        .email("Email invalide")
        .required("L'email est obligatoire"),

    role: yup
        .string()
        .oneOf(ROLES, "Rôle invalide")
        .required("Le rôle est obligatoire"),
});

export default userSchema;