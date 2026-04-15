// PATH: test/Bouton.test.jsx
// Tests unitaires du composant Bouton (tests 1 a 10)
// Import depuis src/components/ - chemin relatif depuis test/

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Bouton from '../src/components/Bouton';

describe('Composant Bouton', () => {

    // TEST 1 - Rendu du texte enfant
    it('affiche le texte passe en enfant', () => {
        render(<Bouton>Cliquez ici</Bouton>);
        expect(
            screen.getByRole('button', { name: /cliquez ici/i })
        ).toBeInTheDocument();
    });

    // TEST 2 - Classe CSS par defaut
    it('applique la classe bouton-principal par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-principal');
    });

    // TEST 3 - Variante secondaire
    it('applique bouton-secondaire quand variante vaut secondaire', () => {
        render(<Bouton variante="secondaire">Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-secondaire');
    });

    // TEST 4 - Taille par defaut
    it('applique bouton-moyen comme taille par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-moyen');
    });

    // TEST 5 - Taille grand
    it('applique bouton-grand quand taille vaut grand', () => {
        render(<Bouton taille="grand">Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-grand');
    });

    // TEST 6 - Etat desactive
    it('est desactive et a la classe bouton-desactive quand disabled vaut true', () => {
        render(<Bouton disabled>Test</Bouton>);
        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        expect(btn).toHaveClass('bouton-desactive');
    });

    // TEST 7 - Declenchement du clic
    it('appelle onClick quand le bouton est clique', () => {
        const handleClick = vi.fn();
        render(<Bouton onClick={handleClick}>Cliquer</Bouton>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // TEST 8 - Pas de clic si desactive
    it('ne declenche pas onClick quand disabled vaut true', () => {
        const handleClick = vi.fn();
        render(<Bouton onClick={handleClick} disabled>Cliquer</Bouton>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    // TEST 9 - Type par defaut
    it('a le type button par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    // TEST 10 - Type submit
    it('accepte type submit en prop', () => {
        render(<Bouton type="submit">Envoyer</Bouton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

});
