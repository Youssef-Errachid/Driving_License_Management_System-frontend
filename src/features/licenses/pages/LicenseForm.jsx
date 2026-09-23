import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Award, Search } from "lucide-react";
import { toast } from "react-toastify";

import licenseSchema, { LICENSE_ISSUING_SERVICE_TYPES } from "../validation/licenseSchema";
import licenseService from "../api/licenseService";
import personService from "../../persons/api/personService";
import { useRequests } from "../../requests/hooks/useRequests";
import { useLicenseCategories } from "../hooks/useLicenseCategories";

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
};

const LicenseForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const prefillPersonId = searchParams.get("personId");

    const { data: categories } = useLicenseCategories();

    const [personQuery, setPersonQuery] = useState("");
    const [personResults, setPersonResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isSearchingPerson, setIsSearchingPerson] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(licenseSchema),
    });

    const { data: requestsPage, isLoading: isLoadingRequests } = useRequests({
        status: "NEW",
        nationalNumber: selectedPerson?.nationalNumber,
        size: 50,
        enabled: Boolean(selectedPerson),
    });

    const eligibleRequests = (requestsPage?.content ?? []).filter((r) =>
        LICENSE_ISSUING_SERVICE_TYPES.includes(r.serviceType),
    );

    const categoryMap = (categories || []).reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
    }, {});

    useEffect(() => {
        if (prefillPersonId) {
            personService.getById(prefillPersonId).then((response) => {
                const person = response.data.data;
                setSelectedPerson(person);
                setValue("personId", person.id);
            });
        }
    }, [prefillPersonId, setValue]);

    const handlePersonSearch = async (value) => {
        setPersonQuery(value);
        if (value.trim().length < 2) {
            setPersonResults([]);
            return;
        }
        setIsSearchingPerson(true);
        try {
            const response = await personService.search(value.trim());
            setPersonResults(response.data.data);
        } finally {
            setIsSearchingPerson(false);
        }
    };

    const handleSelectPerson = (person) => {
        setSelectedPerson(person);
        setValue("personId", person.id);
        setValue("requestId", null);
        setPersonResults([]);
        setPersonQuery("");
    };

    const handleChangePerson = () => {
        setSelectedPerson(null);
        setValue("personId", null);
        setValue("requestId", null);
    };

    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                requestId: data.requestId,
                conditions: null,
                holderPhoto: null,
            };
            return licenseService.create(payload);
        },
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            queryClient.invalidateQueries({ queryKey: ["licenses"] });
            toast.success("Permis délivré avec succès");
            navigate(`/agent/requests/${variables.requestId}`);
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
                <h1 className="text-2xl font-bold text-gray-900">Délivrer un permis</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Award className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Personne et demande</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Personne
                            </label>

                            {selectedPerson ? (
                                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm">
                                    <span className="text-gray-800">
                                        {selectedPerson.firstName} {selectedPerson.lastName} —{" "}
                                        {selectedPerson.nationalNumber}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleChangePerson}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Changer
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={personQuery}
                                        onChange={(e) => handlePersonSearch(e.target.value)}
                                        placeholder="Rechercher par nom ou numéro national"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                               focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                    />
                                    {isSearchingPerson && (
                                        <p className="text-xs text-gray-400 mt-1">Recherche...</p>
                                    )}
                                    {personResults.length > 0 && (
                                        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                                            {personResults.map((person) => (
                                                <button
                                                    key={person.id}
                                                    type="button"
                                                    onClick={() => handleSelectPerson(person)}
                                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    {person.firstName} {person.lastName} —{" "}
                                                    {person.nationalNumber}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {errors.personId && (
                                <p className="text-red-500 text-xs mt-1">{errors.personId.message}</p>
                            )}
                        </div>

                        {selectedPerson && (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                    Demande éligible
                                </label>
                                <select
                                    {...register("requestId")}
                                    defaultValue=""
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                >
                                    <option value="" disabled>
                                        {isLoadingRequests ? "Chargement..." : "Sélectionner une demande"}
                                    </option>
                                    {eligibleRequests.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            #REQ-{r.id} — {SERVICE_TYPE_LABELS[r.serviceType] || r.serviceType}
                                            {r.licenseCategoryId
                                                ? ` — ${categoryMap[r.licenseCategoryId] || ""}`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                                {!isLoadingRequests && eligibleRequests.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Aucune demande éligible (statut NEW) trouvée pour cette personne.
                                    </p>
                                )}
                                {errors.requestId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.requestId.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link
                        to="/agent/requests"
                        className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700
                       hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || mutation.isPending}
                        className="px-6 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                       hover:bg-dlms-amber/90 transition-colors disabled:opacity-60"
                    >
                        {mutation.isPending ? "..." : "Délivrer le permis"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LicenseForm;