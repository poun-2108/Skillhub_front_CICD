// PATH: src/pages/DashboardApprenantPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import inscriptionService from '../services/inscriptionService';
import authService from '../services/authService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bouton from '../components/Bouton';
import './DashboardApprenantPage.css';

export default function DashboardApprenantPage() {
    const { utilisateur, setUtilisateur } = useAuth();
    const navigate = useNavigate();
    const inputPhotoRef = useRef(null);

    const [inscriptions,   setInscriptions]   = useState([]);
    const [chargement,     setChargement]     = useState(true);
    const [messageOk,      setMessageOk]      = useState('');
    const [erreur,         setErreur]         = useState('');
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [filtreActif,    setFiltreActif]    = useState('tout');

    const chargerInscriptions = async () => {
        setChargement(true);
        try {
            const data = await inscriptionService.mesFormations();
            setInscriptions(data);
        } catch (error) {
            // Erreur loggee et affichee (fix SonarQube handle exception)
            console.error('Erreur chargement inscriptions:', error);
            setErreur('Erreur lors du chargement des formations.');
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerInscriptions();
    }, []);

    const handlePhotoChange = async (e) => {
        const fichier = e.target.files[0];
        if (!fichier) return;
        setUploadingPhoto(true);
        try {
            const data = await authService.uploadPhoto(fichier);
            if (data.user) {
                setUtilisateur(data.user);
            } else {
                setUtilisateur(authService.getUtilisateur());
            }
            setMessageOk('Photo mise a jour.');
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            // Erreur loggee (fix SonarQube handle exception)
            console.error('Erreur upload photo:', error);
            setErreur("Erreur upload photo.");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleDesinscrire = async (formationId) => {
        // globalThis.confirm au lieu de window.confirm (fix SonarQube portability)
        if (!globalThis.confirm('Se desinscrire de cette formation ?')) return;
        try {
            await inscriptionService.seDesinscrire(formationId);
            setMessageOk('Desinscription reussie.');
            chargerInscriptions();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            console.error('Erreur desinscription:', error);
            setErreur('Erreur lors de la desinscription.');
        }
    };

    const getNiveauLabel = (n) => ({ debutant: 'Debutant', intermediaire: 'Intermediaire', avance: 'Avance' }[n] || n);

    // Nested ternary extrait en fonction (fix SonarQube)
    const filtrerInscriptions = (liste, filtre) => {
        if (filtre === 'tout')     return liste;
        if (filtre === 'en_cours') return liste.filter(i => i.progression > 0 && i.progression < 100);
        if (filtre === 'termine')  return liste.filter(i => i.progression === 100);
        return liste.filter(i => i.progression === 0);
    };

    const inscriptionsFiltrees = filtrerInscriptions(inscriptions, filtreActif);
    const totalTermines   = inscriptions.filter(i => i.progression === 100).length;
    const totalEnCours    = inscriptions.filter(i => i.progression > 0 && i.progression < 100).length;
    const moyenneProgression = inscriptions.length > 0
        ? Math.round(inscriptions.reduce((s, i) => s + i.progression, 0) / inscriptions.length)
        : 0;

    return (
        <div className="da-page">
            <Navbar />

            <div className="da-hero">
                <div className="da-hero-contenu">
                    <span className="da-hero-label">ESPACE APPRENANT</span>
                    <h1 className="da-hero-titre">Mon Dashboard</h1>
                    <p className="da-hero-sous">
                        Bienvenue <strong>{utilisateur?.nom}</strong> — suivez votre progression
                    </p>
                </div>

                <div className="da-hero-photo-section">
                    <div className="da-avatar-wrapper">
                        {utilisateur?.photo_profil ? (
                            <img
                                src={`http://localhost:8001${utilisateur.photo_profil}`}
                                alt="Profil"
                                className="da-avatar-img"
                            />
                        ) : (
                            <div className="da-avatar-placeholder">
                                {utilisateur?.nom?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <button
                            type="button"
                            className="da-avatar-edit"
                            onClick={() => inputPhotoRef.current?.click()}
                            title="Changer la photo"
                            disabled={uploadingPhoto}
                        >
                            {uploadingPhoto ? '...' : '📷'}
                        </button>
                    </div>
                    <input
                        ref={inputPhotoRef}
                        type="file"
                        accept="image/*"
                        className="da-input-hidden"
                        onChange={handlePhotoChange}
                    />
                </div>
            </div>

            <div className="da-contenu">
                {messageOk && <p className="da-succes">{messageOk}</p>}
                {erreur    && <p className="da-erreur">{erreur}</p>}

                <div className="da-stats">
                    <div className="da-stat-card">
                        <span className="da-stat-valeur">{inscriptions.length}</span>
                        <span className="da-stat-label">Formations</span>
                    </div>
                    <div className="da-stat-card">
                        <span className="da-stat-valeur">{totalTermines}</span>
                        <span className="da-stat-label">Terminees</span>
                    </div>
                    <div className="da-stat-card">
                        <span className="da-stat-valeur">{totalEnCours}</span>
                        <span className="da-stat-label">En cours</span>
                    </div>
                    <div className="da-stat-card">
                        <span className="da-stat-valeur">{moyenneProgression}%</span>
                        <span className="da-stat-label">Progression moy.</span>
                    </div>
                </div>

                <div className="da-filtres">
                    {['tout', 'en_cours', 'termine', 'non_commence'].map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={`da-filtre-btn ${filtreActif === f ? 'da-filtre-actif' : ''}`}
                            onClick={() => setFiltreActif(f)}
                        >
                            {f === 'tout' ? 'Toutes' : f === 'en_cours' ? 'En cours' : f === 'termine' ? 'Terminees' : 'Non commencees'}
                        </button>
                    ))}
                </div>

                {chargement ? (
                    <p className="da-chargement">Chargement...</p>
                ) : inscriptionsFiltrees.length === 0 ? (
                    <div className="da-vide">
                        <p>Aucune formation dans cette categorie.</p>
                        <Bouton variante="principal" onClick={() => navigate('/formations')}>
                            Decouvrir les formations
                        </Bouton>
                    </div>
                ) : (
                    <div className="da-grille">
                        {inscriptionsFiltrees.map((insc) => (
                            <div key={insc.id} className="da-card">
                                <div className={`da-card-bandeau da-bandeau-${insc.formation?.niveau}`} />
                                <div className="da-card-body">
                                    <div className="da-card-badges">
                                        <span className="da-badge-niveau">{getNiveauLabel(insc.formation?.niveau)}</span>
                                    </div>
                                    <h3 className="da-card-titre">{insc.formation?.titre}</h3>
                                    <div className="da-progression">
                                        <div className="da-progression-barre">
                                            <div className="da-progression-fill" style={{ width: `${insc.progression}%` }} />
                                        </div>
                                        <span className="da-progression-pct">{insc.progression}%</span>
                                    </div>
                                    <div className="da-card-actions">
                                        <Bouton
                                            variante="principal"
                                            taille="petit"
                                            onClick={() => navigate(`/apprendre/${insc.formation_id}`)}
                                        >
                                            Continuer
                                        </Bouton>
                                        <Bouton
                                            variante="danger"
                                            taille="petit"
                                            onClick={() => handleDesinscrire(insc.formation_id)}
                                        >
                                            Se desinscrire
                                        </Bouton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
