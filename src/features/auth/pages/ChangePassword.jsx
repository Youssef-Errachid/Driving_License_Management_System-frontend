import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useChangePassword } from "../hooks/useChangePassword";
import changePasswordSchema from "../validation/changePasswordSchema";

const ChangePassword = () => {
    const navigate = useNavigate();
    const changeMutation = useChangePassword();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
    });

    const onSubmit = (data) => {
        changeMutation.mutate(
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => reset(),
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
                <h1 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <KeyRound className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Sécurité du compte</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Mot de passe actuel
                            </label>
                            <input
                                type="password"
                                {...register("currentPassword")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.currentPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                {...register("newPassword")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                {...register("confirmNewPassword")}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            />
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || changeMutation.isPending}
                    className="w-full py-3 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                     hover:bg-dlms-navy/90 transition-colors disabled:opacity-50"
                >
                    Mettre à jour le mot de passe
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;