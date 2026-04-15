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

    // Nested ternary L43 extrait (fix SonarQube)
    const titreFenetre = estModification ? 'Modifier la formation' : 'Creer une formation';
    const labelBoutonSubmit = chargement ? 'Sauvegarde...' : (estModification ? 'Modifier' : 'Creer');

    // role="presentation" + onKeyDown : fix SonarQube overlay non-native interactive
    const handleOverlayKey = (e) => { if (e.key === 'Escape') onFermer(); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setErreur(''); setChargement(true);
        const data = { titre, description, categorie, niveau };
        try {
            if (estModification) { await formationService.modifierFormation(formation.id, data); }
            else { await formationService.creerFormation(data); }
            onSauvegarder();
        } catch (error) {
            setErreur(error.response?.data?.message || 'Erreur lors de la sauvegarde.');
        } finally { setChargement(false); }
    };

    return (
        <div
            role="presentation"
            className="mf-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onFermer(); }}
            onKeyDown={handleOverlayKey}
        >
            <div className="mf-boite">
                <button className="mf-fermer" onClick={onFermer}>✕</button>
                <h2 className="mf-titre">{titreFenetre}</h2>
                {erreur && <p className="mf-erreur">{erreur}</p>}
                <form onSubmit={handleSubmit} className="mf-formulaire">
                    {/* htmlFor sur tous les labels (fix SonarQube label association) */}
                    <label htmlFor="mf-titre" className="mf-label">Titre</label>
                    <input id="mf-titre" type="text" value={titre} onChange={(e) => setTitre(e.target.value)} className="mf-input" placeholder="Titre de la formation" required />

                    <label htmlFor="mf-description" className="mf-label">Description</label>
                    <textarea id="mf-description" value={description} onChange={(e) => setDescription(e.target.value)} className="mf-textarea" placeholder="Description complete" rows={4} required />

                    <label htmlFor="mf-categorie" className="mf-label">Categorie</label>
                    <select id="mf-categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="mf-select">
                        <option value="developpement_web">Developpement web</option>
                        <option value="data">Data</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="devops">DevOps</option>
                        <option value="autre">Autre</option>
                    </select>

                    <label htmlFor="mf-niveau" className="mf-label">Niveau</label>
                    <select id="mf-niveau" value={niveau} onChange={(e) => setNiveau(e.target.value)} className="mf-select">
                        <option value="debutant">Debutant</option>
                        <option value="intermediaire">Intermediaire</option>
                        <option value="avance">Avance</option>
                    </select>

                    <div className="mf-actions">
                        <Bouton type="submit" variante="principal" taille="moyen" disabled={chargement}>{labelBoutonSubmit}</Bouton>
                        <Bouton variante="secondaire" taille="moyen" onClick={onFermer}>Annuler</Bouton>
                    </div>
                </form>
            </div>
        </div>
    );
}

ModalFormation.propTypes = {
    formation: PropTypes.shape({
        id: PropTypes.number, titre: PropTypes.string, description: PropTypes.string,
        categorie: PropTypes.string, niveau: PropTypes.string,
    }),
    onFermer:      PropTypes.func.isRequired,
    onSauvegarder: PropTypes.func.isRequired,
};