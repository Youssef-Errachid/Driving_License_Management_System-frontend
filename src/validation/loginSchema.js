import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Format email invalide")
    .required("Email est obligatoire"),

  password: yup
    .string()
    .min(8, "Minimum 8 caractères")
    .required("Mot de passe est obligatoire"),
});

export default loginSchema;
