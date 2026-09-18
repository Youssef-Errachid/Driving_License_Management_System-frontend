import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useExamTypeConfigs } from "../hooks/useExamTypeConfigs";
import { useUpdateExamTypeConfig } from "../hooks/useUpdateExamTypeConfig";
import { useLicenseCategories } from "../hooks/useLicenseCategories";
import { useUpdateLicenseCategory } from "../hooks/useUpdateLicenseCategory";

const EXAM_TYPE_LABELS = {
    VISION: "Examen de la Vue",
    THEORY: "Examen Théorique",
    PRACTICAL: "Examen Pratique",
};

const ExamTypeSettings = () => {
    const { data: configs, isLoading, isError } = useExamTypeConfigs();
    const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useLicenseCategories();
    const updateMutation = useUpdateExamTypeConfig();
    const updateCategoryMutation = useUpdateLicenseCategory();

    const [fees, setFees] = useState({});
    const [categoryDrafts, setCategoryDrafts] = useState({});

    useEffect(() => {
        if (configs) {
            const initial = {};
            configs.forEach((c) => {
                initial[c.id] = c.fee;
            });
            setFees(initial);
        }
    }, [configs]);

    useEffect(() => {
        if (categories) {
            const initial = {};
            categories.forEach((c) => {
                initial[c.id] = {
                    minimumAge: c.minimumAge,
                    validationDurationYears: c.validationDurationYears,
                    fee: c.fee,
                };
            });
            setCategoryDrafts(initial);
        }
    }, [categories]);

    const handleFeeChange = (id, value) => {
        setFees((prev) => ({ ...prev, [id]: value }));
    };

    const handleBlur = (id, originalFee) => {
        const newFee = fees[id];
        if (newFee === "" || Number(newFee) === Number(originalFee)) return;
        updateMutation.mutate({ id, fee: Number(newFee) });
    };

    const handleCategoryFieldChange = (id, field, value) => {
        setCategoryDrafts((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const handleCategoryBlur = (category, field) => {
        const draft = categoryDrafts[category.id];
        if (!draft) return;
        const newValue = draft[field];
        if (newValue === "" || Number(newValue) === Number(category[field])) return;

        updateCategoryMutation.mutate({
            id: category.id,
            minimumAge: field === "minimumAge" ? Number(newValue) : category.minimumAge,
            validationDurationYears:
                field === "validationDurationYears" ? Number(newValue) : category.validationDurationYears,
            fee: field === "fee" ? Number(newValue) : category.fee,
        });
    };

    const practicalFeeRange = categories?.length
        ? `${Math.min(...categories.map((c) => c.fee))}$ - ${Math.max(...categories.map((c) => c.fee))}$`
        : null;

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#001533]">Gestion des Types d'Examens</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Seuls les frais de chaque examen sont modifiables.
                </p>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger les types d'examens.
                </div>
            )}

            <div className="max-w-3xl bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden mb-10">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-[#E5E1D8] text-left text-xs font-semibold uppercase tracking-wide text-[#001533]">
                        <th className="px-6 py-3">Type d'examen</th>
                        <th className="px-6 py-3 w-40">Frais</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={2} className="px-6 py-8 text-center text-gray-400">
                                Chargement...
                            </td>
                        </tr>
                    ) : (
                        configs?.map((config, index) => {
                            const isPractical = config.examType === "PRACTICAL";
                            return (
                                <tr
                                    key={config.id}
                                    className={`border-t border-[#E5E1D8] ${index % 2 === 1 ? "bg-[#E5E1D8]/30" : ""}`}
                                >
                                    <td className="px-6 py-4 text-gray-800">
                                        <div className="flex items-center gap-1.5">
                                            {EXAM_TYPE_LABELS[config.examType] || config.examType}
                                            {isPractical && (
                                                <span
                                                    className="text-[#FFB555]"
                                                    title={`Défini par la catégorie de permis (${practicalFeeRange || "variable"})`}
                                                >
                                                    <Info className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div
                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm
                                                ${isPractical ? "bg-[#E5E1D8]/40 border-[#E5E1D8] text-gray-400" : "bg-white border-gray-300 focus-within:ring-2 focus-within:ring-[#FFB555]/40 focus-within:border-[#FFB555]"}`}
                                        >
                                            <span className="text-gray-400">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                disabled={isPractical}
                                                value={isPractical ? "" : (fees[config.id] ?? "")}
                                                placeholder={isPractical ? "Variable" : ""}
                                                onChange={(e) => handleFeeChange(config.id, e.target.value)}
                                                onBlur={() => handleBlur(config.id, config.fee)}
                                                className="w-full bg-transparent text-right focus:outline-none disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#001533]">Gestion des Catégories de Permis</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Les catégories sont fixes — seuls l'âge minimum, la durée de validité et les frais sont modifiables.
                </p>
            </div>

            {categoriesError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger les catégories de permis.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-[#E5E1D8] text-left text-xs font-semibold uppercase tracking-wide text-[#001533]">
                        <th className="px-6 py-3">Catégorie</th>
                        <th className="px-6 py-3 w-40">Âge minimum</th>
                        <th className="px-6 py-3 w-40">Durée de validité</th>
                        <th className="px-6 py-3 w-40">Frais</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categoriesLoading ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                Chargement...
                            </td>
                        </tr>
                    ) : (
                        categories?.map((category, index) => {
                            const draft = categoryDrafts[category.id] ?? {};
                            return (
                                <tr
                                    key={category.id}
                                    className={`border-t border-[#E5E1D8] ${index % 2 === 1 ? "bg-[#E5E1D8]/30" : ""}`}
                                >
                                    <td className="px-6 py-4 text-gray-800">
                                        <p className="font-medium text-[#001533]">{category.name}</p>
                                        {category.description && (
                                            <p className="text-xs text-gray-400">{category.description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus-within:ring-2 focus-within:ring-[#FFB555]/40 focus-within:border-[#FFB555]">
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={draft.minimumAge ?? ""}
                                                onChange={(e) =>
                                                    handleCategoryFieldChange(category.id, "minimumAge", e.target.value)
                                                }
                                                onBlur={() => handleCategoryBlur(category, "minimumAge")}
                                                className="w-full bg-transparent text-right focus:outline-none"
                                            />
                                            <span className="text-gray-400 whitespace-nowrap">ans</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus-within:ring-2 focus-within:ring-[#FFB555]/40 focus-within:border-[#FFB555]">
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={draft.validationDurationYears ?? ""}
                                                onChange={(e) =>
                                                    handleCategoryFieldChange(
                                                        category.id,
                                                        "validationDurationYears",
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() => handleCategoryBlur(category, "validationDurationYears")}
                                                className="w-full bg-transparent text-right focus:outline-none"
                                            />
                                            <span className="text-gray-400 whitespace-nowrap">ans</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus-within:ring-2 focus-within:ring-[#FFB555]/40 focus-within:border-[#FFB555]">
                                            <span className="text-gray-400">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={draft.fee ?? ""}
                                                onChange={(e) => handleCategoryFieldChange(category.id, "fee", e.target.value)}
                                                onBlur={() => handleCategoryBlur(category, "fee")}
                                                className="w-full bg-transparent text-right focus:outline-none"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamTypeSettings;