import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Search, UserPlus } from "lucide-react";
import personService from "../api/services/personService";
import { useCreateUser } from "../hooks/useCreateUser";
import userSchema, { ROLES } from "../validation/userSchema";

const ROLE_LABELS = {
    ADMIN: "Administrateur",
    AGENT: "Agent",
};

const UserForm = () => {
    const navigate = useNavigate();
    const createMutation = useCreateUser();

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
        resolver: yupResolver(userSchema),
    });

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
        setValue("email", person.email);
        setPersonResults([]);
        setPersonQuery("");
    };

    const onSubmit = (data) => {
        createMutation.mutate(
            {
                personId: data.personId,
                email: data.email,
                role: data.role,
            },
            {
                onSuccess: () => navigate("/admin/users"),
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
                <h1 className="text-2xl font-bold text-gray-900">Nouvel utilisateur</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <UserPlus className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h2 className="text-base font-bold text-gray-900">Détails du compte</h2>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Un mot de passe sera généré automatiquement et envoyé à l'adresse email de l'utilisateur.
                    </p>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Personne
                            </label>

                            {selectedPerson ? (
                                <div
                                    className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm">
                                    <span className="text-gray-800">
                                        {selectedPerson.firstName} {selectedPerson.lastName} —{" "}
                                        {selectedPerson.nationalNumber}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPerson(null);
                                            setValue("personId", null);
                                            setValue("email", "");
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Changer
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
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
                                        <div
                                            className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
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

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                readOnly={!!selectedPerson}
                                placeholder="exemple@dlms.ma"
                                className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy
                           ${selectedPerson ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
                                Rôle
                            </label>
                            <select
                                {...register("role")}
                                defaultValue=""
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                            >
                                <option value="" disabled>
                                    Sélectionner le rôle
                                </option>
                                {ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {ROLE_LABELS[role]}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || createMutation.isPending}
                    className="w-full py-3 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                     hover:bg-dlms-navy/90 transition-colors disabled:opacity-50"
                >
                    Créer l'utilisateur
                </button>
            </form>
        </div>
    );
};

export default UserForm;