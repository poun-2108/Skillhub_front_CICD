// PATH: src/pages/ApprendrePage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import formationService from '../services/formationService';
import moduleService from '../services/moduleService';
import inscriptionService from '../services/inscriptionService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bouton from '../components/Bouton';
import './ApprendrePage.css';

export default function ApprendrePage() {
    const { id }   = useParams();
    const navigate = useNavigate();
    // Variable utilisateur supprimee car inutilisee (fix SonarQube unused)
    const { } = useAuth();

    const [formation,       setFormation]       = useState(null);
    const [modules,         setModules]         = useState([]);
    const [inscription,     setInscription]     = useState(null);
    const [modulesTermines, setModulesTermines] = useState([]);
    const [chargement,      setChargement]      = useState(true);
    const [erreur,          setErreur]          = useState('');
    const [messageOk,       setMessageOk]       = useState('');
    const [moduleActif,     setModuleActif]     = useState(null);
    const [loadingTerminer, setLoadingTerminer] = useState(false);

    const charger = async () => {
        try {
            const [dataFormation, dataModules, mesFormations, termines] = await Promise.all([
                formationService.getFormation(id),
                moduleService.getModules(id),
                inscriptionService.mesFormations(),
                moduleService.getMesModulesTermines(id),
            ]);

            setFormation(dataFormation);
            setModules(dataModules);
            setModulesTermines(termines.modules_termines ?? []);

            const insc = mesFormations.find(
                // Number.parseInt au lieu de parseInt (fix SonarQube)
                (i) => Number.parseInt(i.formation_id, 10) === Number.parseInt(id, 10)
            );

            if (!insc) {
                navigate('/dashboard/apprenant');
                return;
            }
            setInscription(insc);

            if (dataModules.length > 0) {
                setModuleActif(dataModules[0]);
            }
        } catch (error) {
            // Erreur loggee et affichee (fix SonarQube handle exception)
            console.error('Erreur chargement formation:', error);
            setErreur('Erreur lors du chargement de la formation.');
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        charger();
    }, [id]);

    const handleTerminer = async (moduleId) => {
        setLoadingTerminer(true);
        setErreur('');
        try {
            await moduleService.terminerModule(moduleId);
            setModulesTermines((prev) => [...prev, moduleId]);
            setMessageOk('Module marqué comme terminé !');
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            console.error('Erreur terminer module:', error);
            setErreur('Erreur lors de la mise à jour du module.');
        } finally {
            setLoadingTerminer(false);
        }
    };

    const progression = modules.length > 0
        ? Math.round((modulesTermines.length / modules.length) * 100)
        : 0;

    if (chargement) return <div className="apprendre-chargement">Chargement...</div>;

    if (!formation || !inscription) return null;

    return (
        <div className="apprendre-page">
            <Navbar />
            <div className="apprendre-contenu">
                {erreur    && <p className="apprendre-erreur">{erreur}</p>}
                {messageOk && <p className="apprendre-succes">{messageOk}</p>}

                <div className="apprendre-header">
                    <h1 className="apprendre-titre">{formation.titre}</h1>
                    <div className="apprendre-progression">
                        <span>{progression}% complété</span>
                        <div className="apprendre-barre">
                            <div className="apprendre-barre-fill" style={{ width: `${progression}%` }} />
                        </div>
                    </div>
                </div>

                <div className="apprendre-layout">
                    <aside className="apprendre-sidebar">
                        <h3 className="apprendre-sidebar-titre">Modules</h3>
                        {modules.map((mod) => (
                            <button
                                key={mod.id}
                                type="button"
                                className={`apprendre-module-item ${moduleActif?.id === mod.id ? 'apprendre-module-actif' : ''} ${modulesTermines.includes(mod.id) ? 'apprendre-module-termine' : ''}`}
                                onClick={() => setModuleActif(mod)}
                            >
                                <span className="apprendre-module-ordre">{mod.ordre}</span>
                                <span className="apprendre-module-titre">{mod.titre}</span>
                                {modulesTermines.includes(mod.id) && <span className="apprendre-check">✓</span>}
                            </button>
                        ))}
                    </aside>

                    <main className="apprendre-main">
                        {moduleActif ? (
                            <div className="apprendre-module-detail">
                                <h2 className="apprendre-module-nom">{moduleActif.titre}</h2>
                                <div className="apprendre-module-contenu">
                                    <p>{moduleActif.contenu}</p>
                                </div>
                                {!modulesTermines.includes(moduleActif.id) && (
                                    <Bouton
                                        variante="principal"
                                        onClick={() => handleTerminer(moduleActif.id)}
                                        disabled={loadingTerminer}
                                    >
                                        {loadingTerminer ? 'Enregistrement...' : 'Marquer comme terminé'}
                                    </Bouton>
                                )}
                            </div>
                        ) : (
                            <p className="apprendre-select">Sélectionnez un module dans la liste.</p>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
