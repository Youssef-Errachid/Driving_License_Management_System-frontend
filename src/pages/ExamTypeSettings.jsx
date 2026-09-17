import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useExamTypeConfigs } from "../hooks/useExamTypeConfigs";
import { useUpdateExamTypeConfig } from "../hooks/useUpdateExamTypeConfig";
import { useLicenseCategories } from "../hooks/useLicenseCategories";

const EXAM_TYPE_LABELS = {
    VISION: "Examen de la Vue",
    THEORY: "Examen Théorique",
    PRACTICAL: "Examen Pratique",
};

const ExamTypeSettings = () => {
    const { data: configs, isLoading, isError } = useExamTypeConfigs();
    const { data: categories } = useLicenseCategories();
    const updateMutation = useUpdateExamTypeConfig();

    const [fees, setFees] = useState({});

    useEffect(() => {
        if (configs) {
            const initial = {};
            configs.forEach((c) => {
                initial[c.id] = c.fee;
            });
            setFees(initial);
        }
    }, [configs]);

    const handleFeeChange = (id, value) => {
        setFees((prev) => ({ ...prev, [id]: value }));
    };

    const handleBlur = (id, originalFee) => {
        const newFee = fees[id];
        if (newFee === "" || Number(newFee) === Number(originalFee)) return;
        updateMutation.mutate({ id, fee: Number(newFee) });
    };

    const practicalFeeRange = categories?.length
        ? `${Math.min(...categories.map((c) => c.fee))}$ - ${Math.max(...categories.map((c) => c.fee))}$`
        : null;

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Types d'Examens</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Seuls les frais de chaque examen sont modifiables.
                </p>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger les types d'examens.
                </div>
            )}

            <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                                    className={`border-t border-gray-100 ${index % 2 === 1 ? "bg-gray-50/50" : ""}`}
                                >
                                    <td className="px-6 py-4 text-gray-800">
                                        <div className="flex items-center gap-1.5">
                                            {EXAM_TYPE_LABELS[config.examType] || config.examType}
                                            {isPractical && (
                                                <span
                                                    className="text-gray-400"
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
                                                ${isPractical ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-gray-300"}`}
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
        </div>
    );
};

export default ExamTypeSettings;