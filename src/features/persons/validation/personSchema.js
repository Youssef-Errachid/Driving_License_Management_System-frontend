import * as yup from "yup";

const personSchema = yup.object({
    nationalNumber: yup
        .string()
        .trim()
        .required("Le numéro national est obligatoire"),

    firstName: yup
        .string()
        .trim()
        .required("Le prénom est obligatoire"),

    lastName: yup
        .string()
        .trim()
        .required("Le nom est obligatoire"),

    birthDay: yup
        .date()
        .typeError("La date de naissance est invalide")
        .max(new Date(), "La date de naissance doit être dans le passé")
        .required("La date de naissance est obligatoire"),

    address: yup
        .string()
        .trim()
        .nullable(),

    phoneNumber: yup
        .string()
        .trim()
        .nullable()
        .matches(/^[0-9+ ]{8,15}$/, {
            message: "Numéro de téléphone invalide",
            excludeEmptyString: true,
        }),

    email: yup
        .string()
        .trim()
        .email("Format email invalide")
        .required("Email est obligatoire"),

    nationality: yup
        .string()
        .trim()
        .nullable(),

    photo: yup
        .string()
        .trim()
        .nullable(),

    gender: yup
        .string()
        .oneOf(["MALE", "FEMALE"], "Genre invalide")
        .nullable(),
});

export default personSchema;