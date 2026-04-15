// PATH: test/Authservice.test.js
// 12 tests - authService.js
// Objectif : couvrir profile(), uploadPhoto(), getToken(),
//            getUtilisateur() avec donnees valides/invalides
// => Coverage authService.js > 80% (requis SonarCloud Quality Gate)

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

    // TEST 17 - login stocke l utilisateur (cle 'user')
    it('login stocke l utilisateur serialise dans localStorage', async () => {
        api.post.mockResolvedValue({
            data: { token: 'token-xyz', user: { id: 2, nom: 'Bob', role: 'formateur' } },
        });
        await authService.login('bob@mail.com', 'pass');
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

    // TEST 21 - register stocke le token
    it('register stocke le token dans localStorage apres inscription', async () => {
        api.post.mockResolvedValue({
            data: { token: 'token-register', user: { id: 3, nom: 'Nouveau', role: 'apprenant' } },
        });
        await authService.register('Nouveau', 'new@mail.com', 'pass', 'pass', 'apprenant');
        expect(setItemSpy).toHaveBeenCalledWith('token', 'token-register');
    });

    // TEST 22 - estConnecte retourne false si pas de token
    it('estConnecte retourne false quand localStorage est vide', () => {
        expect(authService.estConnecte()).toBe(false);
    });

    // TEST 23 - profile() appelle GET /profile et stocke l utilisateur
    it('profile appelle GET /profile et stocke l utilisateur', async () => {
        api.get.mockResolvedValue({
            data: { user: { id: 5, nom: 'Charlie', role: 'formateur' } },
        });
        await authService.profile();
        // Verifie que l utilisateur est stocke apres recuperation du profil
        expect(setItemSpy).toHaveBeenCalledWith('user', expect.any(String));
        expect(api.get).toHaveBeenCalledWith('/profile');
    });

    // TEST 24 - uploadPhoto() appelle POST /profil/photo
    it('uploadPhoto appelle POST /profil/photo avec un FormData', async () => {
        const fichierMock = new File(['contenu'], 'photo.jpg', { type: 'image/jpeg' });
        api.post.mockResolvedValue({
            data: { user: { id: 1, nom: 'Alice', photo_profil: '/photos/1.jpg' } },
        });
        const result = await authService.uploadPhoto(fichierMock);
        expect(api.post).toHaveBeenCalledWith('/profil/photo', expect.any(FormData), expect.any(Object));
        expect(result.user.nom).toBe('Alice');
    });

    // TEST 25 - getToken() retourne le token depuis localStorage
    it('getToken retourne le token stocke dans localStorage', () => {
        localStorage.setItem('token', 'mon-token-stocke');
        expect(authService.getToken()).toBe('mon-token-stocke');
    });

    // TEST 26 - getToken() retourne null si absent
    it('getToken retourne null si aucun token en localStorage', () => {
        expect(authService.getToken()).toBeNull();
    });

    // TEST 27 - getUtilisateur() retourne l objet parse si present
    it('getUtilisateur retourne l objet utilisateur parse depuis localStorage', () => {
        const user = { id: 7, nom: 'Diana', role: 'apprenant' };
        localStorage.setItem('utilisateur', JSON.stringify(user));
        const result = authService.getUtilisateur();
        expect(result).toEqual(user);
    });

});