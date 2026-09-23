import * as yup from "yup";

const changePasswordSchema = yup.object({
    currentPassword: yup
        .string()
        .required("Le mot de passe actuel est obligatoire"),

    newPassword: yup
        .string()
        .required("Le nouveau mot de passe est obligatoire")
        .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),

    confirmNewPassword: yup
        .string()
        .required("La confirmation du mot de passe est obligatoire")
        .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas"),
});

export default changePasswordSchema;