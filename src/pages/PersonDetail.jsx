import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Pencil, FilePlus2 } from "lucide-react";
import { usePerson } from "../hooks/usePerson";

const GENDER_LABELS = {
    MALE: "Masculin",
    FEMALE: "Féminin",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const PersonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: person, isLoading, isError } = usePerson(id);

    if (isLoading) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (isError || !person) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <div className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger le profil de cette personne.
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
                <h1 className="text-2xl font-bold text-gray-900">Profil de la personne</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-dlms-navy overflow-hidden flex items-center justify-center bg-white">
                            {person.photo ? (
                                <img
                                    src={person.photo}
                                    alt={`${person.firstName} ${person.lastName}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-dlms-navy" strokeWidth={1.5} />
                            )}
                        </div>

                        <h2 className="text-base font-bold text-gray-900 mb-2">
                            {person.firstName} {person.lastName}
                        </h2>

                        <span className="inline-block px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">
                            ID-{person.nationalNumber}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Link
                            to={`/agent/persons/${person.id}/edit`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                         hover:bg-dlms-navy/90 transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                            Modifier le profil
                        </Link>

                        <Link
                            to={`/agent/requests/new?personId=${person.id}`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700
                         hover:bg-gray-50 transition-colors"
                        >
                            <FilePlus2 className="h-4 w-4" />
                            Nouvelle demande
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <User className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h3 className="text-base font-bold text-gray-900">Information Personnelle</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Date de naissance
                                </p>
                                <p className="text-sm text-gray-800">{formatDate(person.birthDay)}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Nationalité
                                </p>
                                <p className="text-sm text-gray-800">{person.nationality || "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Genre
                                </p>
                                <p className="text-sm text-gray-800">
                                    {GENDER_LABELS[person.gender] || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h3 className="text-base font-bold text-gray-900">Coordonnées</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Email
                                </p>
                                <p className="text-sm text-gray-800">{person.email || "-"}</p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Numéro de téléphone
                                </p>
                                <p className="text-sm text-gray-800">{person.phoneNumber || "-"}</p>
                            </div>

                            <div className="sm:col-span-2">
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Adresse physique
                                </p>
                                <p className="text-sm text-gray-800">{person.address || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonDetail;