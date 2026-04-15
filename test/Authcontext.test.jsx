// PATH: test/Authcontext.test.jsx
// 5 tests - AuthContext

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';

vi.mock('../src/services/authService', () => {
    return {
        default: {
            login:          vi.fn(),
            register:       vi.fn(),
            logout:         vi.fn(),
            getUtilisateur: vi.fn(() => null),
            getToken:       vi.fn(() => null),
            estConnecte:    vi.fn(() => false),
        },
    };
});

import authService from '../src/services/authService';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function ComposantTest({ onMount }) {
    const auth = useAuth();
    if (onMount) onMount(auth);
    return (
        <div>
            <span data-testid="connecte">{String(auth.estConnecte())}</span>
            <span data-testid="formateur">{String(auth.estFormateur())}</span>
            <span data-testid="apprenant">{String(auth.estApprenant())}</span>
        </div>
    );
}

describe('AuthContext', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        authService.getUtilisateur.mockReturnValue(null);
    });

    it('estConnecte retourne false quand aucun utilisateur en session', () => {
        render(<AuthProvider><ComposantTest /></AuthProvider>);
        expect(screen.getByTestId('connecte').textContent).toBe('false');
    });

    it('estFormateur retourne true pour un utilisateur avec role formateur', () => {
        authService.getUtilisateur.mockReturnValue({ id: 1, role: 'formateur', nom: 'Prof' });
        localStorage.setItem('token', 'fake-token');
        render(<AuthProvider><ComposantTest /></AuthProvider>);
        expect(screen.getByTestId('formateur').textContent).toBe('true');
        expect(screen.getByTestId('apprenant').textContent).toBe('false');
    });

    it('estApprenant retourne true pour un utilisateur avec role apprenant', () => {
        authService.getUtilisateur.mockReturnValue({ id: 2, role: 'apprenant', nom: 'Eleve' });
        localStorage.setItem('token', 'fake-token');
        render(<AuthProvider><ComposantTest /></AuthProvider>);
        expect(screen.getByTestId('apprenant').textContent).toBe('true');
        expect(screen.getByTestId('formateur').textContent).toBe('false');
    });

    it('login met a jour utilisateur dans le contexte', async () => {
        const fakeUser = { id: 3, role: 'apprenant', nom: 'Nouveau' };
        authService.login.mockResolvedValue({ user: fakeUser, token: 'new-token' });

        let authRef;
        render(<AuthProvider><ComposantTest onMount={(a) => { authRef = a; }} /></AuthProvider>);

        await act(async () => { await authRef.login('test@mail.com', 'password123'); });

        await waitFor(() => {
            expect(screen.getByTestId('connecte').textContent).toBe('true');
        });
    });

    it('logout remet utilisateur a null dans le contexte', async () => {
        authService.getUtilisateur.mockReturnValue({ id: 4, role: 'apprenant', nom: 'Test' });
        localStorage.setItem('token', 'fake-token');
        authService.logout.mockResolvedValue({});

        let authRef;
        render(<AuthProvider><ComposantTest onMount={(a) => { authRef = a; }} /></AuthProvider>);

        expect(screen.getByTestId('connecte').textContent).toBe('true');

        await act(async () => { await authRef.logout(); });

        await waitFor(() => {
            expect(screen.getByTestId('connecte').textContent).toBe('false');
        });
    });

});
