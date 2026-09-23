import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Ban } from "lucide-react";

import licenseBlockSchema from "../validation/licenseBlockSchema";
import { useBlockLicense } from "../hooks/useBlockLicense";

const LicenseBlockForm = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(licenseBlockSchema),
    });

    const mutation = useBlockLicense();

    const onSubmit = (data) => {
        mutation.mutate(
            {
                licenseId: data.licenseId,
                reason: data.reason,
                fineAmount: data.fineAmount,
            },
            {
                onSuccess: () => {
                    navigate("/agent/dashboard");
                },
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
                <h1 className="text-2xl font-bold text-gray-900">Bloquer un permis</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Ban className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Détails du blocage</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Permis concerné (ID)
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 45"
                                {...register("licenseId")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.licenseId && (
                                <p className="text-red-500 text-xs mt-1">{errors.licenseId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Motif
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Infraction au code de la route"
                                {...register("reason")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.reason && (
                                <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Montant de l&apos;amende
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Ex: 500"
                                {...register("fineAmount")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.fineAmount && (
                                <p className="text-red-500 text-xs mt-1">{errors.fineAmount.message}</p>
                            )}
                        </div>
                    </div>
                </div>

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
                        disabled={isSubmitting || mutation.isPending}
                        className="px-6 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                       hover:bg-dlms-amber/90 transition-colors disabled:opacity-60"
                    >
                        {mutation.isPending ? "..." : "Bloquer le permis"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LicenseBlockForm;