// PATH: src/components/ModalFormation.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import formationService from '../services/formationService';
import Bouton from './Bouton';
import './ModalFormation.css';

export default function ModalFormation({ formation, onFermer, onSauvegarder }) {
    const estModification = formation !== null;

    const [titre,       setTitre]       = useState(formation?.titre       || '');
    const [description, setDescription] = useState(formation?.description || '');
    const [categorie,   setCategorie]   = useState(formation?.categorie   || 'developpement_web');
    const [niveau,      setNiveau]      = useState(formation?.niveau      || 'debutant');
    const [erreur,      setErreur]      = useState('');
    const [chargement,  setChargement]  = useState(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onFermer();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur('');
        setChargement(true);
        const data = { titre, description, categorie, niveau };
        try {
            if (estModification) {
                await formationService.modifierFormation(formation.id, data);
            } else {
                await formationService.creerFormation(data);
            }
            onSauvegarder();
        } catch (error) {
            const msg = error.response?.data?.message || 'Erreur lors de la sauvegarde.';
            setErreur(msg);
        } finally {
            setChargement(false);
        }
    };

    // Nested ternary extrait en variable (fix SonarQube)
    const labelBoutonSubmit = chargement ? 'Sauvegarde...' : (estModification ? 'Modifier' : 'Créer');

    return (
        <div className="mf-overlay" onClick={handleOverlayClick}>
            <div className="mf-boite">
                <button className="mf-fermer" onClick={onFermer}>✕</button>
                <h2 className="mf-titre">
                    {estModification ? 'Modifier la formation' : 'Créer une formation'}
                </h2>
                {erreur && <p className="mf-erreur">{erreur}</p>}
                <form onSubmit={handleSubmit} className="mf-formulaire">
                    <label className="mf-label">Titre</label>
                    <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="mf-input" placeholder="Titre de la formation" required />
                    <label className="mf-label">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mf-textarea" placeholder="Description complète de la formation" rows={4} required />
                    <label className="mf-label">Catégorie</label>
                    <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="mf-select">
                        <option value="developpement_web">Développement web</option>
                        <option value="data">Data</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="devops">DevOps</option>
                        <option value="autre">Autre</option>
                    </select>
                    <label className="mf-label">Niveau</label>
                    <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="mf-select">
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                    </select>
                    <div className="mf-actions">
                        <Bouton type="submit" variante="principal" taille="moyen" disabled={chargement}>
                            {labelBoutonSubmit}
                        </Bouton>
                        <Bouton variante="secondaire" taille="moyen" onClick={onFermer}>
                            Annuler
                        </Bouton>
                    </div>
                </form>
            </div>
        </div>
    );
}

ModalFormation.propTypes = {
    formation: PropTypes.shape({
        id:          PropTypes.number,
        titre:       PropTypes.string,
        description: PropTypes.string,
        categorie:   PropTypes.string,
        niveau:      PropTypes.string,
    }),
    onFermer:      PropTypes.func.isRequired,
    onSauvegarder: PropTypes.func.isRequired,
};
