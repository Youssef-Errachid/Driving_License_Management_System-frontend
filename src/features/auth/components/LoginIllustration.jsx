import illustration from "../../../assets/road-card-illustration.png";
import dlmsLogo from "../../../assets/dlms-logo.png";

const LoginIllustration = () => {
  return (
    <section className="hidden lg:flex lg:w-1/2 bg-dlms-navy flex-col justify-between p-12 relative overflow-hidden">
      <div className="z-10">
        <img
          src={dlmsLogo}
          alt="DLMS - Driving License Management System"
          className="h-8 w-auto select-none pointer-events-none"
        />
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <img
          src={illustration}
          alt="Illustration représentant la gestion des permis de conduire"
          className="w-full max-w-md object-contain select-none pointer-events-none"
        />
      </div>

      <div className="text-center text-white z-10">
        <h1 className="text-3xl font-bold mb-4">
          Gestion simplifiée des permis
          <br />
          de conduire
        </h1>

        <p className="text-white/70 text-sm">
          Plateforme interne réservée aux agents et
          <br />
          administrateurs du département
        </p>
      </div>
    </section>
  );
};

export default LoginIllustration;
