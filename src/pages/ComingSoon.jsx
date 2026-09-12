import { Construction } from "lucide-react";

const ComingSoon = ({ title }) => {
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                    <Construction className="h-8 w-8 text-dlms-amber" strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500">
                    Cette page est en cours de développement.
                </p>
            </div>
        </div>
    );
};

export default ComingSoon;