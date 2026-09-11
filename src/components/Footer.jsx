const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 py-4">
                © {new Date().getFullYear()} Système de Gestion des Permis de
                Conduire (DLMS). Tous droits réservés.
            </p>
        </footer>
    );
};

export default Footer;