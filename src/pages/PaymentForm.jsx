import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Search } from "lucide-react";

import paymentSchema, { PAYMENT_TYPES } from "../validation/paymentSchema";
import personService from "../api/services/personService";
import { useRequests } from "../hooks/useRequests";
import { useLicenseBlocks } from "../hooks/useLicenseBlocks";
import { useCreatePayment } from "../hooks/useCreatePayment";

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    EXAM_RETAKE: "Reprise d'examen",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
    UNBLOCKING: "Déblocage",
    INTERNATIONAL_LICENSE: "Permis international",
};

const PAYMENT_TYPE_LABELS = {
    APPLICATION_FEE: "Frais de dossier",
    VISION_EXAM: "Examen de la vue",
    THEORY_EXAM: "Examen théorique",
    PRACTICAL_EXAM: "Examen pratique",
    SERVICE: "Frais de service",
    FINE: "Amende (déblocage)",
};

const PaymentForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefillRequestId = searchParams.get("requestId");

    const [personQuery, setPersonQuery] = useState("");
    const [personResults, setPersonResults] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isSearchingPerson, setIsSearchingPerson] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const createMutation = useCreatePayment();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(paymentSchema),
    });

    const paymentType = watch("paymentType");

    const { data: requestsPage, isLoading: isLoadingRequests } = useRequests({
        status: "NEW",
        nationalNumber: selectedPerson?.nationalNumber,
        size: 50,
        enabled: Boolean(selectedPerson),
    });
    const eligibleRequests = requestsPage?.content ?? [];

    const { data: licenseBlocks, isLoading: isLoadingBlocks } = useLicenseBlocks(
        paymentType === "FINE" ? selectedRequest?.licenseId : null,
    );
    const activeBlocks = (licenseBlocks || []).filter((b) => !b.unblockingDate);

    // Préremplissage depuis ?requestId= (ex: RequestDetail)
    useEffect(() => {
        if (prefillRequestId) {
            setValue("requestId", Number(prefillRequestId));
        }
    }, [prefillRequestId, setValue]);

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
        setPersonResults([]);
        setPersonQuery("");
    };

    const handleSelectRequest = (e) => {
        const id = Number(e.target.value);
        setValue("requestId", id);
        const req = eligibleRequests.find((r) => r.id === id);
        setSelectedRequest(req || null);
        setValue("licenseBlockId", null);
    };

    const onSubmit = (data) => {
        createMutation.mutate(
            {
                requestId: data.requestId,
                paymentType: data.paymentType,
                licenseBlockId: data.paymentType === "FINE" ? data.licenseBlockId : null,
            },
            {
                onSuccess: () => navigate(`/agent/requests/${data.requestId}`),
            },
        );
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
                <h1 className="text-2xl font-bold text-gray-900">Enregistrer un paiement</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <CreditCard className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
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
                                        onClick={() => {
                                            setSelectedPerson(null);
                                            setSelectedRequest(null);
                                            setValue("requestId", null);
                                        }}
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
                        </div>

                        {selectedPerson && (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                    Demande (statut NEW)
                                </label>
                                <select
                                    onChange={handleSelectRequest}
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
                                        </option>
                                    ))}
                                </select>
                                {!isLoadingRequests && eligibleRequests.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Aucune demande au statut NEW trouvée pour cette personne.
                                    </p>
                                )}
                                {errors.requestId && (
                                    <p className="text-red-500 text-xs mt-1">{errors.requestId.message}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {selectedRequest && (
                    <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <CreditCard className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h2 className="text-base font-bold text-gray-900">Détails du paiement</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                    Type de paiement
                                </label>
                                <select
                                    {...register("paymentType")}
                                    defaultValue=""
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                >
                                    <option value="" disabled>
                                        Sélectionner le type de paiement
                                    </option>
                                    {PAYMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {PAYMENT_TYPE_LABELS[type]}
                                        </option>
                                    ))}
                                </select>
                                {errors.paymentType && (
                                    <p className="text-red-500 text-xs mt-1">{errors.paymentType.message}</p>
                                )}
                            </div>

                            {paymentType === "FINE" && (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                        Blocage concerné
                                    </label>
                                    {!selectedRequest.licenseId ? (
                                        <p className="text-xs text-gray-400">
                                            Cette demande n'est liée à aucun permis.
                                        </p>
                                    ) : (
                                        <select
                                            {...register("licenseBlockId")}
                                            defaultValue=""
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                                 focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                                        >
                                            <option value="" disabled>
                                                {isLoadingBlocks ? "Chargement..." : "Sélectionner un blocage actif"}
                                            </option>
                                            {activeBlocks.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.reason} — {b.fineAmount}$ ({b.blockingDate})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {errors.licenseBlockId && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.licenseBlockId.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3">
                    <Link
                        to="/agent/dashboard"
                        className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700
                       hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting || createMutation.isPending || !selectedRequest}
                        className="px-6 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                       hover:bg-dlms-amber/90 transition-colors disabled:opacity-60"
                    >
                        {createMutation.isPending ? "..." : "Enregistrer le paiement"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;