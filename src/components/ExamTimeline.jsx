import { useState } from "react";
import { Eye, FileText, Shield, Lock, Info } from "lucide-react";
import { useScheduleExam } from "../hooks/useScheduleExam";
import { useRecordExamResult } from "../hooks/useRecordExamResult";

const EXAM_STEPS = [
    { type: "VISION", label: "Examen de la vue", icon: Eye },
    { type: "THEORY", label: "Examen théorique", icon: FileText },
    { type: "PRACTICAL", label: "Examen pratique", icon: Shield },
];

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const StatusBadge = ({ children, variant }) => {
    const variants = {
        passed: "bg-[#0a1f44] text-white",
        failed: "bg-red-50 text-red-700 border border-red-200",
        pending: "bg-amber-50 text-amber-700 border border-amber-200",
        locked: "bg-gray-100 text-gray-400 border border-gray-200",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
            {children}
        </span>
    );
};

const ExamTimeline = ({ requestId, exams, isLoadingExams, feeMap }) => {
    const [scheduleFor, setScheduleFor] = useState(null); // examType currently being scheduled
    const [resultForId, setResultForId] = useState(null); // exam id currently getting a result

    const scheduleMutation = useScheduleExam(requestId);
    const resultMutation = useRecordExamResult(requestId);

    const findExam = (type) => (exams || []).find((e) => e.examType === type);
    const isPassed = (type) => findExam(type)?.examResult === "PASSED";

    const isUnlocked = (index) => {
        if (index === 0) return true;
        const previousType = EXAM_STEPS[index - 1].type;
        return isPassed(previousType);
    };

    const handleSchedule = (examType, appointmentDate) => {
        scheduleMutation.mutate(
            { requestId: Number(requestId), examType, appointmentDate },
            { onSuccess: () => setScheduleFor(null) },
        );
    };

    const handleRecordResult = (examId, result, score) => {
        resultMutation.mutate(
            { id: examId, data: { result, score: score || null } },
            { onSuccess: () => setResultForId(null) },
        );
    };

    if (isLoadingExams) {
        return <p className="text-sm text-gray-400">Chargement...</p>;
    }

    return (
        <div>
            <div className="space-y-0">
                {EXAM_STEPS.map((step, index) => {
                    const exam = findExam(step.type);
                    const unlocked = isUnlocked(index);
                    const Icon = step.icon;
                    const isLast = index === EXAM_STEPS.length - 1;

                    let statusNode;
                    if (exam?.examResult === "PASSED") {
                        statusNode = <StatusBadge variant="passed">Admis</StatusBadge>;
                    } else if (exam?.examResult === "FAILED") {
                        statusNode = <StatusBadge variant="failed">Échoué</StatusBadge>;
                    } else if (exam) {
                        statusNode = <StatusBadge variant="pending">En attente</StatusBadge>;
                    } else if (!unlocked) {
                        statusNode = <StatusBadge variant="locked">Verrouillé</StatusBadge>;
                    }

                    const fee = feeMap?.[step.type];

                    return (
                        <div key={step.type} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                                        ${exam?.examResult === "PASSED" ? "bg-[#0a1f44] text-white" : ""}
                                        ${exam && !exam.examResult ? "bg-dlms-amber text-white" : ""}
                                        ${exam?.examResult === "FAILED" ? "bg-red-500 text-white" : ""}
                                        ${!exam && !unlocked ? "bg-gray-200 text-gray-400" : ""}
                                        ${!exam && unlocked ? "bg-white border-2 border-dlms-navy text-dlms-navy" : ""}
                                    `}
                                >
                                    {!exam && !unlocked ? <Lock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                </div>
                                {!isLast && <div className="w-px flex-1 bg-gray-300 min-h-[2rem]" />}
                            </div>

                            <div className="flex-1 pb-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-bold text-gray-900 uppercase">
                                                {step.label}
                                            </h4>
                                            {exam?.examType === "THEORY" && exam?.score != null && (
                                                <span className="text-xs px-2 py-0.5 rounded border border-gray-300 bg-white text-gray-600">
                                                    Score : {exam.score}/40
                                                </span>
                                            )}
                                        </div>

                                        {exam ? (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {fee != null && `Frais : ${fee}$ · `}
                                                {exam.examResult
                                                    ? `Effectué le ${formatDate(exam.resultDate)}`
                                                    : `Prévu le ${formatDate(exam.appointmentDate)}`}
                                            </p>
                                        ) : unlocked ? (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {fee != null && `Frais : ${fee}$ · `}Non planifié
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Non planifié · Conditionné par l'examen précédent
                                            </p>
                                        )}
                                    </div>

                                    {statusNode}
                                </div>

                                {unlocked && !exam && (
                                    <div className="mt-2">
                                        {scheduleFor === step.type ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const date = e.target.appointmentDate.value;
                                                    handleSchedule(step.type, date);
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="date"
                                                    name="appointmentDate"
                                                    required
                                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={scheduleMutation.isPending}
                                                    className="px-3 py-1.5 rounded-lg bg-dlms-navy text-white text-xs font-semibold"
                                                >
                                                    Confirmer
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setScheduleFor(null)}
                                                    className="text-xs text-gray-500"
                                                >
                                                    Annuler
                                                </button>
                                            </form>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setScheduleFor(step.type)}
                                                className="text-xs font-semibold text-dlms-amber hover:underline"
                                            >
                                                + Planifier un rendez-vous
                                            </button>
                                        )}
                                    </div>
                                )}

                                {exam && !exam.examResult && (
                                    <div className="mt-2">
                                        {resultForId === exam.id ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    const result = e.target.result.value;
                                                    const score = e.target.score?.value;
                                                    handleRecordResult(exam.id, result, score);
                                                }}
                                                className="flex items-center gap-2 flex-wrap"
                                            >
                                                <select
                                                    name="result"
                                                    required
                                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                                                >
                                                    <option value="">Résultat...</option>
                                                    <option value="PASSED">Admis</option>
                                                    <option value="FAILED">Échoué</option>
                                                </select>
                                                {step.type === "THEORY" && (
                                                    <input
                                                        type="number"
                                                        name="score"
                                                        min="0"
                                                        max="40"
                                                        placeholder="Note /40"
                                                        className="w-24 px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                                                    />
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={resultMutation.isPending}
                                                    className="px-3 py-1.5 rounded-lg bg-dlms-navy text-white text-xs font-semibold"
                                                >
                                                    Confirmer
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setResultForId(null)}
                                                    className="text-xs text-gray-500"
                                                >
                                                    Annuler
                                                </button>
                                            </form>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setResultForId(exam.id)}
                                                className="text-xs font-semibold text-dlms-amber hover:underline"
                                            >
                                                + Enregistrer le résultat
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-start gap-2 pt-4 mt-2 border-t border-gray-300 text-xs text-gray-500">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>L'ordre des examens est obligatoire : Vue → Théorique → Pratique</span>
            </div>
        </div>
    );
};

export default ExamTimeline;