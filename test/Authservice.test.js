// PATH: test/Authservice.test.js
// Tests authService - 7 tests pour couvrir >96% des lignes du service
// Tests 16-20 : login, logout, getUtilisateur, estConnecte
// Tests bonus  : register, clear (pour monter la couverture)

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../src/services/axiosConfig', () => {
    return {
        default: {
            post:   vi.fn(),
            get:    vi.fn(),
            put:    vi.fn(),
            delete: vi.fn(),
            interceptors: {
                request:  { use: vi.fn() },
                response: { use: vi.fn() },
            },
        },
    };
});

import api         from '../src/services/axiosConfig';
import authService from '../src/services/authService';

describe('authService', () => {

    let setItemSpy;
    let removeItemSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        setItemSpy    = vi.spyOn(Storage.prototype, 'setItem');
        removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    });

    afterEach(() => {
        setItemSpy.mockRestore();
        removeItemSpy.mockRestore();
    });

    // TEST 16 - login stocke le token
    it('login stocke le token dans localStorage', async () => {
        api.post.mockResolvedValue({
            data: { token: 'mon-token-jwt', user: { id: 1, nom: 'Alice', role: 'apprenant' } },
        });

        await authService.login('alice@mail.com', 'secret');

        expect(setItemSpy).toHaveBeenCalledWith('token', 'mon-token-jwt');
    });

    // TEST 17 - login stocke l utilisateur (cle 'user' confirme par les logs)
    it('login stocke l utilisateur serialise dans localStorage', async () => {
        api.post.mockResolvedValue({
            data: { token: 'token-xyz', user: { id: 2, nom: 'Bob', role: 'formateur' } },
        });

        await authService.login('bob@mail.com', 'pass');

        // La cle reelle est 'user' (confirme par Vitest spy logs)
        expect(setItemSpy).toHaveBeenCalledWith('user', expect.any(String));
    });

    // TEST 18 - logout supprime token et user
    it('logout appelle removeItem pour token et user', async () => {
        localStorage.setItem('token', 'ancien-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, nom: 'Alice' }));

        api.post.mockResolvedValue({ data: { message: 'Deconnecte' } });

        await authService.logout();

        expect(removeItemSpy).toHaveBeenCalledWith('token');
        expect(removeItemSpy).toHaveBeenCalledWith('user');
    });

    // TEST 19 - getUtilisateur retourne null si localStorage vide
    it('getUtilisateur retourne null quand localStorage est vide', () => {
        expect(authService.getUtilisateur()).toBeNull();
    });

    // TEST 20 - estConnecte retourne true si token present
    it('estConnecte retourne true quand un token existe dans localStorage', () => {
        localStorage.setItem('token', 'valid-token');
        expect(authService.estConnecte()).toBe(true);
    });

    // TEST BONUS A - register stocke le token apres inscription
    it('register stocke le token dans localStorage apres inscription', async () => {
        api.post.mockResolvedValue({
            data: {
                token: 'token-register',
                user:  { id: 3, nom: 'Nouveau', role: 'apprenant' },
            },
        });

        await authService.register('Nouveau', 'new@mail.com', 'pass', 'pass', 'apprenant');

        expect(setItemSpy).toHaveBeenCalledWith('token', 'token-register');
    });

    // TEST BONUS B - clear supprime toutes les donnees de session
    it('clear supprime token et user du localStorage', () => {
        localStorage.setItem('token', 'token-a-supprimer');
        localStorage.setItem('user', JSON.stringify({ id: 99 }));

        authService.clear();

        expect(removeItemSpy).toHaveBeenCalledWith('token');
        expect(removeItemSpy).toHaveBeenCalledWith('user');
    });

});