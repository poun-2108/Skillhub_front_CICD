// PATH: src/services/authService.js
import api from './axiosConfig';

/**
 * Normalise l utilisateur recu du backend.
 */
function normaliserUtilisateur(user) {
    if (!user) return null;
    return {
        ...user,
        nom:  user.nom  || user.name || '',
        name: user.name || user.nom  || '',
    };
}

const authService = {

    async register(nom, email, password, passwordConfirmation, role) {
        const payload = { nom, email, password, password_confirmation: passwordConfirmation, role };
        const reponse = await api.post('/register', payload);

        // optional chain au lieu de reponse.data && reponse.data.user (fix SonarQube)
        const utilisateurNormalise = normaliserUtilisateur(reponse.data?.user);

        if (reponse.data?.token) {
            localStorage.setItem('token', reponse.data.token);
        }
        if (utilisateurNormalise) {
            localStorage.setItem('user', JSON.stringify(utilisateurNormalise));
        }
        return { ...reponse.data, user: utilisateurNormalise };
    },

    async login(email, password) {
        const reponse = await api.post('/login', { email, password });

        // optional chain (fix SonarQube)
        const utilisateurNormalise = normaliserUtilisateur(reponse.data?.user);

        if (reponse.data?.token) {
            localStorage.setItem('token', reponse.data.token);
        }
        if (utilisateurNormalise) {
            localStorage.setItem('user', JSON.stringify(utilisateurNormalise));
        }
        return { ...reponse.data, user: utilisateurNormalise };
    },

    async profile() {
        const reponse = await api.get('/profile');
        const utilisateurNormalise = normaliserUtilisateur(reponse.data?.user);
        if (utilisateurNormalise) {
            localStorage.setItem('user', JSON.stringify(utilisateurNormalise));
        }
        return { ...reponse.data, user: utilisateurNormalise };
    },

    async logout() {
        const reponse = await api.post('/logout', {});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return reponse.data;
    },

    async uploadPhoto(fichier) {
        const formData = new FormData();
        formData.append('photo', fichier);
        const reponse = await api.post('/profil/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const utilisateurNormalise = normaliserUtilisateur(reponse.data?.user);
        if (utilisateurNormalise) {
            localStorage.setItem('user', JSON.stringify(utilisateurNormalise));
        }
        return { ...reponse.data, user: utilisateurNormalise };
    },

    getUtilisateur() {
        const utilisateur = localStorage.getItem('utilisateur');
        if (!utilisateur) return null;
        try {
            return JSON.parse(utilisateur);
        } catch (error) {
            console.error('Erreur parsing utilisateur:', error);
            return null;
        }
    },

    getToken() {
        return localStorage.getItem('token');
    },

    estConnecte() {
        return !!localStorage.getItem('token');
    },

    clear() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
