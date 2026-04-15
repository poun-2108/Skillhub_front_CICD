// PATH: src/components/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const annee = new Date().getFullYear();

    return (
        <footer className="footer">

            <div className="footer-bandeau">
                <div className="footer-brand">
                    <span className="footer-brand-nom">SKILLHUB</span>
                    <span className="footer-brand-tag">SKILLS FOR THE FUTURE</span>
                </div>

                <div className="footer-newsletter">
                    <span className="footer-news-titre">NEWSLETTER</span>
                    <span className="footer-news-sub">Inscrivez-vous pour ne rien manquer</span>
                    <button className="footer-news-btn">+ Je m&apos;inscris</button>
                </div>

                {/* href valide : ancre top de page */}
                <a href="#top" className="footer-top">⤴</a>
            </div>

            <div className="footer-principal">
                <div className="footer-col">
                    <h4 className="footer-col-titre">Adresse</h4>
                    <p className="footer-col-texte">
                        57 Avenue Ollier<br />
                        Quatre Bornes, Maurice
                    </p>
                    <h4 className="footer-col-titre footer-mt">Téléphone</h4>
                    <a className="footer-lien-rouge" href="tel:+23055525559">+230 555 25 59</a>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-titre">Navigation</h4>
                    <Link to="/"           className="footer-lien">Accueil</Link>
                    <Link to="/formations" className="footer-lien">Formations</Link>
                    <Link to="/"           className="footer-lien">À propos</Link>
                    <Link to="/"           className="footer-lien">Contact</Link>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-titre">Informations</h4>
                    {/* Liens remplacés par des boutons accessibles (href="#" invalide) */}
                    <button type="button" className="footer-lien footer-lien-btn">Mentions légales</button>
                    <button type="button" className="footer-lien footer-lien-btn">Conditions générales</button>
                    <button type="button" className="footer-lien footer-lien-btn">Protection des données</button>
                    <button type="button" className="footer-lien footer-lien-btn">Gestion des cookies</button>
                </div>

                <div className="footer-col footer-col-droite">
                    <div className="footer-social">
                        <button type="button" className="footer-social-btn" aria-label="Facebook">f</button>
                        <button type="button" className="footer-social-btn" aria-label="Instagram">◎</button>
                        <button type="button" className="footer-social-btn" aria-label="YouTube">▶</button>
                    </div>
                    <p className="footer-credit">
                        WEBSITE BY<br />
                        <span>SKILLHUB TEAM</span>
                    </p>
                </div>
            </div>

            <div className="footer-bas">
                <p>© {annee} Skillhub | All Rights Reserved</p>
                <div className="footer-bas-liens">
                    <button type="button" className="footer-lien footer-lien-btn">Privacy Policy</button>
                    <span>•</span>
                    <button type="button" className="footer-lien footer-lien-btn">Terms &amp; Conditions</button>
                </div>
            </div>

        </footer>
    );
}
