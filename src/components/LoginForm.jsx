import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import loginSchema from "../validation/loginSchema";
import { useAuth } from "../context/AuthContext";
import dlmsIconMark from "../assets/dlms_icon_mark.png";

const LoginForm = () => {
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Email ou mot de passe incorrect",
      );
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={dlmsIconMark}
            alt="DLMS"
            className="h-8 w-8 object-contain"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          Driving License Management System
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5">
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Connexion
        </h3>

        {serverError && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Entrez votre email"
            {...register("email")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            {...register("password")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg font-semibold text-sm
             bg-dlms-amber/80 text-white border border-white/30
             backdrop-blur-md transition-all duration-300
             hover:bg-dlms-amber hover:-translate-y-[2px]
             hover:shadow-[0_12px_30px_rgba(200,134,13,0.35)]
             disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "..." : "Se connecter"}
        </button>

        <p className="text-center text-xs text-gray-400 pt-2">
          Accès réservé au personnel autorisé du département
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
