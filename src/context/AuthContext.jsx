// PATH: src/context/AuthContext.jsx
import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from 'prop-types';
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [utilisateur, setUtilisateur] = useState(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('utilisateur');
            return null;
        }
        return authService.getUtilisateur();
    });

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUtilisateur(data.user);
        return data;
    };

    const register = async (nom, email, password, passwordConfirmation, role) => {
        const data = await authService.register(nom, email, password, passwordConfirmation, role);
        setUtilisateur(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUtilisateur(null);
    };

    const estConnecte  = () => utilisateur !== null;
    const estFormateur = () => utilisateur !== null && utilisateur.role === "formateur";
    const estApprenant = () => utilisateur !== null && utilisateur.role === "apprenant";

    // useMemo evite de recreer l objet a chaque render (fix SonarQube)
    const valeur = useMemo(() => ({
        utilisateur,
        setUtilisateur,
        login,
        register,
        logout,
        estConnecte,
        estFormateur,
        estApprenant,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [utilisateur]);

    return (
        <AuthContext.Provider value={valeur}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    return useContext(AuthContext);
}
