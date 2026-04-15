// PATH: src/components/ModalAuth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import Bouton from './Bouton';
import './ModalAuth.css';

export default function ModalAuth({ mode = 'login', onFermer }) {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [onglet, setOnglet] = useState(mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('apprenant');
    const [erreur, setErreur] = useState('');
    const [messageOk, setMessageOk] = useState('');
    const [chargement, setChargement] = useState(false);

    // role="presentation" + onKeyDown : fix SonarQube non-native interactive (overlay)
    const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onFermer(); };
    const handleOverlayKey   = (e) => { if (e.key === 'Escape') onFermer(); };

    const handleLogin = async (e) => {
        e.preventDefault(); setErreur(''); setMessageOk(''); setChargement(true);
        try {
            const data = await login(email, password);
            onFermer();
            if (data?.user?.role === 'formateur') { navigate('/dashboard/formateur'); } else { navigate('/dashboard/apprenant'); }
        } catch (error) {
            setErreur(error.response?.data?.error || error.response?.data?.message || 'Email ou mot de passe incorrect.');
        } finally { setChargement(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault(); setErreur(''); setMessageOk('');
        if (passwordReg !== passwordConfirmation) { setErreur('Les mots de passe ne correspondent pas.'); return; }
        setChargement(true);
        try {
            const data = await register(nom, emailReg, passwordReg, passwordConfirmation, role);
            if (data?.token && data?.user) {
                onFermer();
                if (data.user.role === 'formateur') { navigate('/dashboard/formateur'); } else { navigate('/dashboard/apprenant'); }
            } else {
                setMessageOk(data?.message || 'Compte cree avec succes.');
                setNom(''); setEmailReg(''); setPasswordReg(''); setPasswordConfirmation(''); setRole('apprenant');
                setTimeout(() => { setOnglet('login'); setMessageOk(''); }, 1200);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErreur(Object.values(error.response.data.errors).flat().join(' | '));
            } else {
                setErreur(error.response?.data?.error || error.response?.data?.message || "Erreur lors de l inscription.");
            }
        } finally { setChargement(false); }
    };

    return (
        /* role="presentation" + onKeyDown : fix SonarQube overlay non-native interactive */
        <div
            role="presentation"
            className="modal-overlay"
            onClick={handleOverlayClick}
            onKeyDown={handleOverlayKey}
        >
            <div className="modal-boite">
                <button className="modal-fermer" onClick={onFermer}>✕</button>
                <div className="modal-onglets">
                    <button className={`modal-onglet ${onglet === 'login' ? 'modal-onglet-actif' : ''}`}
                            onClick={() => { setOnglet('login'); setErreur(''); setMessageOk(''); }}>
                        Se connecter
                    </button>
                    <button className={`modal-onglet ${onglet === 'register' ? 'modal-onglet-actif' : ''}`}
                            onClick={() => { setOnglet('register'); setErreur(''); setMessageOk(''); }}>
                        S&apos;inscrire
                    </button>
                </div>

                {messageOk && <p className="modal-succes">{messageOk}</p>}
                {erreur    && <p className="modal-erreur">{erreur}</p>}

                {onglet === 'login' && (
                    <form onSubmit={handleLogin} className="modal-formulaire">
                        {/* htmlFor lie le label a l input (fix SonarQube label association) */}
                        <label htmlFor="login-email" className="modal-label">Email</label>
                        <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="modal-input" placeholder="votre@email.com" required />
                        <label htmlFor="login-password" className="modal-label">Mot de passe</label>
                        <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="modal-input" placeholder="••••••••" required />
                        <Bouton type="submit" variante="principal" taille="grand" disabled={chargement}>
                            {chargement ? 'Connexion...' : 'Se connecter'}
                        </Bouton>
                    </form>
                )}

                {onglet === 'register' && (
                    <form onSubmit={handleRegister} className="modal-formulaire">
                        <label htmlFor="reg-nom" className="modal-label">Nom complet</label>
                        <input id="reg-nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="modal-input" placeholder="Jean Dupont" required />
                        <label htmlFor="reg-email" className="modal-label">Email</label>
                        <input id="reg-email" type="email" value={emailReg} onChange={(e) => setEmailReg(e.target.value)} className="modal-input" placeholder="votre@email.com" required />
                        <label htmlFor="reg-password" className="modal-label">Mot de passe</label>
                        <input id="reg-password" type="password" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} className="modal-input" placeholder="Minimum 6 caracteres" required />
                        <label htmlFor="reg-confirm" className="modal-label">Confirmer le mot de passe</label>
                        <input id="reg-confirm" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="modal-input" placeholder="Repetez votre mot de passe" required />
                        <label htmlFor="reg-role" className="modal-label">Je suis</label>
                        <select id="reg-role" value={role} onChange={(e) => setRole(e.target.value)} className="modal-select">
                            <option value="apprenant">Apprenant</option>
                            <option value="formateur">Formateur</option>
                        </select>
                        <Bouton type="submit" variante="principal" taille="grand" disabled={chargement}>
                            {chargement ? 'Creation...' : 'Creer mon compte'}
                        </Bouton>
                    </form>
                )}
            </div>
        </div>
    );
}

ModalAuth.propTypes = {
    mode:     PropTypes.string,
    onFermer: PropTypes.func.isRequired,
};