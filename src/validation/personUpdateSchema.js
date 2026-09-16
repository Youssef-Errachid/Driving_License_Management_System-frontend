import * as yup from "yup";

const personUpdateSchema = yup.object({
    firstName: yup
        .string()
        .trim()
        .required("Le prénom est obligatoire"),

    lastName: yup
        .string()
        .trim()
        .required("Le nom est obligatoire"),

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
        .nullable(),

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

export default personUpdateSchema;