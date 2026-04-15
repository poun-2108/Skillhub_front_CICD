// PATH: test/Bouton.test.jsx
// 10 tests - composant Bouton

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Bouton from '../src/components/Bouton';

describe('Composant Bouton', () => {

    it('affiche le texte passe en enfant', () => {
        render(<Bouton>Cliquez ici</Bouton>);
        expect(screen.getByRole('button', { name: /cliquez ici/i })).toBeInTheDocument();
    });

    it('applique la classe bouton-principal par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-principal');
    });

    it('applique bouton-secondaire quand variante vaut secondaire', () => {
        render(<Bouton variante="secondaire">Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-secondaire');
    });

    it('applique bouton-moyen comme taille par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-moyen');
    });

    it('applique bouton-grand quand taille vaut grand', () => {
        render(<Bouton taille="grand">Test</Bouton>);
        expect(screen.getByRole('button')).toHaveClass('bouton-grand');
    });

    it('est desactive et a la classe bouton-desactive quand disabled vaut true', () => {
        render(<Bouton disabled>Test</Bouton>);
        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        expect(btn).toHaveClass('bouton-desactive');
    });

    it('appelle onClick quand le bouton est clique', () => {
        const handleClick = vi.fn();
        render(<Bouton onClick={handleClick}>Cliquer</Bouton>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('ne declenche pas onClick quand disabled vaut true', () => {
        const handleClick = vi.fn();
        render(<Bouton onClick={handleClick} disabled>Cliquer</Bouton>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('a le type button par defaut', () => {
        render(<Bouton>Test</Bouton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('accepte type submit en prop', () => {
        render(<Bouton type="submit">Envoyer</Bouton>);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

});
