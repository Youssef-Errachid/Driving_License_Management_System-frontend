import { useEffect, useState } from "react";
import cloudinaryService from "../../../lib/cloudinaryService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, MapPin } from "lucide-react";
import { toast } from "react-toastify";

import personSchema from "../validation/personSchema";
import personUpdateSchema from "../validation/personUpdateSchema";
import personService from "../api/personService";
import { usePerson } from "../hooks/usePerson";

const PersonForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: existingPerson, isLoading: isLoadingPerson } = usePerson(id, {
        enabled: isEditMode,
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(isEditMode ? personUpdateSchema : personSchema),
    });

    const [isUploading, setIsUploading] = useState(false);
    const photoUrl = watch("photo");

    useEffect(() => {
        if (isEditMode && existingPerson) {
            reset({
                firstName: existingPerson.firstName,
                lastName: existingPerson.lastName,
                address: existingPerson.address || "",
                phoneNumber: existingPerson.phoneNumber || "",
                email: existingPerson.email || "",
                nationality: existingPerson.nationality || "",
                photo: existingPerson.photo || "",
                gender: existingPerson.gender || "",
            });
        }
    }, [isEditMode, existingPerson, reset]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await cloudinaryService.uploadImage(file);
            setValue("photo", url, { shouldValidate: true });
        } catch {
            toast.error("Échec du téléversement de la photo. Veuillez réessayer.");
        } finally {
            setIsUploading(false);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isEditMode) {
                return personService.update(id, data);
            }
            return personService.create(data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["persons"] });
            toast.success(
                isEditMode ? "Personne mise à jour avec succès" : "Personne enregistrée avec succès",
            );
            const personId = isEditMode ? id : response.data.data.id;
            navigate(`/agent/persons/${personId}`);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.",
            );
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    if (isEditMode && isLoadingPerson) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Retour"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? "Modifier une personne" : "Enregistrer une personne"}
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <User className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Information Personnelle</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Prénom
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Jean"
                                {...register("firstName")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Nom
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Dupont"
                                {...register("lastName")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                            )}
                        </div>

                        {!isEditMode && (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    {...register("birthDay")}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                />
                                {errors.birthDay && (
                                    <p className="text-red-500 text-xs mt-1">{errors.birthDay.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Genre
                            </label>
                            <select
                                {...register("gender")}
                                defaultValue=""
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            >
                                <option value="" disabled>
                                    Sélectionner le genre
                                </option>
                                <option value="MALE">Homme</option>
                                <option value="FEMALE">Femme</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                            )}
                        </div>

                        {!isEditMode && (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                    Numéro national
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: 123456789"
                                    {...register("nationalNumber")}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                />
                                {errors.nationalNumber && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nationalNumber.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Nationalité
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Française"
                                {...register("nationality")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.nationality && (
                                <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Photo
                            </label>

                            <div className="flex items-center gap-4">
                                {photoUrl && (
                                    <img
                                        src={photoUrl}
                                        alt="Aperçu"
                                        className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                    />
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={isUploading}
                                    className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg
                                               file:border-0 file:bg-dlms-navy file:text-white file:text-sm file:font-semibold
                                               hover:file:bg-dlms-navy/90"
                                />
                                {isUploading && (
                                    <span className="text-xs text-gray-400">Téléversement...</span>
                                )}
                            </div>

                            {/* champ réel envoyé avec le formulaire */}
                            <input type="hidden" {...register("photo")} />

                            {errors.photo && (
                                <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <MapPin className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Coordonnées</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                placeholder="Ex: jean.dupont@email.com"
                                {...register("email")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Numéro de téléphone
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: +33 6 12 34 56 78"
                                {...register("phoneNumber")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Adresse
                            </label>
                            <input
                                type="text"
                                placeholder="123 Rue de la République, 75001 Paris"
                                {...register("address")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        to="/agent/persons"
                        className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700
                       hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending || isUploading}
                        className="px-6 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                       hover:bg-dlms-amber/90 transition-colors disabled:opacity-60"
                    >
                        {mutation.isPending ? "..." : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonForm;