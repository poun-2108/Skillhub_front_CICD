// PATH: src/components/ModalModules.jsx
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moduleService from '../services/moduleService';
import Bouton from './Bouton';
import './ModalModules.css';

export default function ModalModules({ formation, onFermer }) {
    const [modules,      setModules]      = useState([]);
    const [chargement,   setChargement]   = useState(true);
    const [erreur,       setErreur]       = useState('');
    const [messageOk,    setMessageOk]    = useState('');
    const [titre,        setTitre]        = useState('');
    const [contenu,      setContenu]      = useState('');
    const [ordre,        setOrdre]        = useState(1);
    const [ajoutVisible, setAjoutVisible] = useState(false);
    const [loadingAjout, setLoadingAjout] = useState(false);
    const [moduleModif,  setModuleModif]  = useState(null);

    const chargerModules = async () => {
        setChargement(true);
        try {
            const data = await moduleService.getModules(formation.id);
            setModules(data);
            setOrdre(data.length + 1);
        } catch (error) {
            // Erreur loggee et affichee a l utilisateur
            console.error('Erreur chargement modules:', error);
            setErreur('Erreur lors du chargement des modules.');
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        chargerModules();
    }, [formation.id]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onFermer();
    };

    const handleAjouter = async (e) => {
        e.preventDefault();
        setErreur('');
        setLoadingAjout(true);
        try {
            await moduleService.creerModule(formation.id, { titre, contenu, ordre });
            setTitre('');
            setContenu('');
            setAjoutVisible(false);
            setMessageOk('Module ajouté avec succès.');
            chargerModules();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            console.error('Erreur creation module:', error);
            setErreur('Erreur lors de la création du module.');
        } finally {
            setLoadingAjout(false);
        }
    };

    const handleModifier = async (e) => {
        e.preventDefault();
        setErreur('');
        try {
            await moduleService.modifierModule(moduleModif.id, {
                titre:   moduleModif.titre,
                contenu: moduleModif.contenu,
                ordre:   moduleModif.ordre,
            });
            setModuleModif(null);
            setMessageOk('Module modifié avec succès.');
            chargerModules();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            console.error('Erreur modification module:', error);
            setErreur('Erreur lors de la modification du module.');
        }
    };

    const handleSupprimer = async (id) => {
        // globalThis.confirm au lieu de window.confirm (fix SonarQube portability)
        const confirme = globalThis.confirm('Supprimer ce module ?');
        if (!confirme) return;
        try {
            await moduleService.supprimerModule(id);
            setMessageOk('Module supprimé.');
            chargerModules();
            setTimeout(() => setMessageOk(''), 3000);
        } catch (error) {
            console.error('Erreur suppression module:', error);
            setErreur('Erreur lors de la suppression.');
        }
    };

    // Nested ternary extrait (fix SonarQube)
    const labelBoutonAjout = loadingAjout ? 'Ajout...' : 'Ajouter';

    return (
        <div className="mm-overlay" onClick={handleOverlayClick}>
            <div className="mm-boite">
                <button className="mm-fermer" onClick={onFermer}>✕</button>
                <h2 className="mm-titre">Modules — {formation.titre}</h2>

                {messageOk && <p className="mm-succes">{messageOk}</p>}
                {erreur    && <p className="mm-erreur">{erreur}</p>}

                {chargement ? (
                    <p className="mm-chargement">Chargement...</p>
                ) : modules.length === 0 ? (
                    <p className="mm-vide">Aucun module pour cette formation.</p>
                ) : (
                    <div className="mm-liste">
                        {modules.map((module) => (
                            <div key={module.id} className="mm-item">
                                {moduleModif?.id === module.id ? (
                                    <form onSubmit={handleModifier} className="mm-form-modif">
                                        <input
                                            type="text"
                                            value={moduleModif.titre}
                                            onChange={(e) => setModuleModif({ ...moduleModif, titre: e.target.value })}
                                            className="mm-input"
                                            required
                                        />
                                        <textarea
                                            value={moduleModif.contenu}
                                            onChange={(e) => setModuleModif({ ...moduleModif, contenu: e.target.value })}
                                            className="mm-textarea"
                                            rows={3}
                                            required
                                        />
                                        <input
                                            type="number"
                                            value={moduleModif.ordre}
                                            // Number.parseInt au lieu de parseInt (fix SonarQube)
                                            onChange={(e) => setModuleModif({ ...moduleModif, ordre: Number.parseInt(e.target.value, 10) })}
                                            className="mm-input-ordre"
                                            min={1}
                                            required
                                        />
                                        <div className="mm-item-actions">
                                            <Bouton type="submit" variante="principal" taille="petit">Sauvegarder</Bouton>
                                            <Bouton variante="secondaire" taille="petit" onClick={() => setModuleModif(null)}>Annuler</Bouton>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="mm-item-info">
                                            <span className="mm-item-ordre">{module.ordre}</span>
                                            <div>
                                                <p className="mm-item-titre">{module.titre}</p>
                                                <p className="mm-item-apercu">
                                                    {module.contenu?.slice(0, 60)}
                                                    {module.contenu?.length > 60 ? '...' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mm-item-actions">
                                            <Bouton variante="secondaire" taille="petit" onClick={() => setModuleModif({ ...module })}>Modifier</Bouton>
                                            <Bouton variante="danger" taille="petit" onClick={() => handleSupprimer(module.id)}>Supprimer</Bouton>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {ajoutVisible ? (
                    <form onSubmit={handleAjouter} className="mm-form-ajout">
                        <h3 className="mm-form-titre">Nouveau module</h3>
                        <label className="mm-label">Titre</label>
                        <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="mm-input" placeholder="Titre du module" required />
                        <label className="mm-label">Contenu</label>
                        <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} className="mm-textarea" placeholder="Contenu du module" rows={4} required />
                        <label className="mm-label">Ordre</label>
                        <input
                            type="number"
                            value={ordre}
                            // Number.parseInt au lieu de parseInt (fix SonarQube)
                            onChange={(e) => setOrdre(Number.parseInt(e.target.value, 10))}
                            className="mm-input-ordre"
                            min={1}
                            required
                        />
                        <div className="mm-item-actions">
                            <Bouton type="submit" variante="principal" taille="petit" disabled={loadingAjout}>
                                {labelBoutonAjout}
                            </Bouton>
                            <Bouton variante="secondaire" taille="petit" onClick={() => setAjoutVisible(false)}>Annuler</Bouton>
                        </div>
                    </form>
                ) : (
                    <div className="mm-btn-ajouter">
                        <Bouton variante="fantome" taille="petit" onClick={() => setAjoutVisible(true)}>
                            + Ajouter un module
                        </Bouton>
                    </div>
                )}
            </div>
        </div>
    );
}

ModalModules.propTypes = {
    formation: PropTypes.shape({
        id:    PropTypes.number.isRequired,
        titre: PropTypes.string.isRequired,
    }).isRequired,
    onFermer: PropTypes.func.isRequired,
};
