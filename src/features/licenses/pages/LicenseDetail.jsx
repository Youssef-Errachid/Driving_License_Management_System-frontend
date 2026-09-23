import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award } from "lucide-react";

import { useLicense } from "../hooks/useLicense";

const ISSUE_REASON_LABELS = {
    NEW: "Nouveau Permis",
    RENEWAL: "Renouvellement",
    REPLACEMENT_LOST: "Duplicata perdu",
    REPLACEMENT_DAMAGED: "Duplicata endommagé",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const BlockingBadge = ({ status }) => {
    const blocked = status === "BLOCKED";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border
                ${blocked ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
        >
            {blocked ? "Bloqué" : "Actif"}
        </span>
    );
};

const LicenseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: license, isLoading, isError } = useLicense(id);

    if (isLoading) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (isError || !license) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <div className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger ce permis.
                </div>
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
                    Permis {license.licenseNumber}
                </h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h3 className="text-base font-bold text-gray-900">Informations du permis</h3>
                        </div>
                        <BlockingBadge status={license.blockingStatus} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {license.holderPhoto && (
                            <div className="sm:col-span-2">
                                <img
                                    src={license.holderPhoto}
                                    alt="Titulaire"
                                    className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                />
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Titulaire</p>
                            <p className="text-sm text-gray-800">{license.holderFullName}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Numéro national
                            </p>
                            <p className="text-sm text-gray-800">{license.holderNationalNumber}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Date de naissance du titulaire
                            </p>
                            <p className="text-sm text-gray-800">{formatDate(license.holderBirthDate)}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Catégorie de permis
                            </p>
                            <p className="text-sm text-gray-800">{license.licenseCategoryName}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Délivré le</p>
                            <p className="text-sm text-gray-800">{formatDate(license.issueDate)}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Expire le</p>
                            <p className="text-sm text-gray-800">{formatDate(license.expirationDate)}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Motif</p>
                            <p className="text-sm text-gray-800">
                                {ISSUE_REASON_LABELS[license.issueReason] || license.issueReason}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Agent délivreur
                            </p>
                            <p className="text-sm text-gray-800">{license.issuingAgentEmail || "-"}</p>
                        </div>

                        {license.conditions && (
                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Conditions
                                </p>
                                <p className="text-sm text-gray-800">{license.conditions}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicenseDetail;