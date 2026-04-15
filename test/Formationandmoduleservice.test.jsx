// PATH: test/Formationandmoduleservice.test.jsx
// Tests services formations et modules (tests 21 a 30)
// Tests 27 et 30 : remplaces par creerModule et supprimerModule
// (getMesFormations et getMesModulesTermines absents dans la version du projet)

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axiosConfig declare avant les imports des services
vi.mock('../src/services/axiosConfig', () => {
    return {
        default: {
            get:    vi.fn(),
            post:   vi.fn(),
            put:    vi.fn(),
            delete: vi.fn(),
            interceptors: {
                request:  { use: vi.fn() },
                response: { use: vi.fn() },
            },
        },
    };
});

import api              from '../src/services/axiosConfig';
import formationService from '../src/services/formationService';
import moduleService    from '../src/services/moduleService';

// ── formationService ─────────────────────────────────────────

describe('formationService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // TEST 21 - getFormations sans filtre
    it('getFormations appelle GET /formations et retourne les donnees', async () => {
        const formations = [
            { id: 1, titre: 'React' },
            { id: 2, titre: 'Laravel' },
        ];
        api.get.mockResolvedValue({ data: formations });

        const result = await formationService.getFormations();

        expect(api.get).toHaveBeenCalledWith('/formations', { params: {} });
        expect(result).toEqual(formations);
    });

    // TEST 22 - getFormations avec filtres
    it('getFormations passe les filtres en query params', async () => {
        api.get.mockResolvedValue({ data: [] });

        await formationService.getFormations({ categorie: 'dev' });

        expect(api.get).toHaveBeenCalledWith('/formations', {
            params: { categorie: 'dev' },
        });
    });

    // TEST 23 - getFormation par id
    it('getFormation appelle GET /formations/:id avec le bon identifiant', async () => {
        const formation = { id: 5, titre: 'TypeScript' };
        api.get.mockResolvedValue({ data: formation });

        const result = await formationService.getFormation(5);

        expect(api.get).toHaveBeenCalledWith('/formations/5');
        expect(result.titre).toBe('TypeScript');
    });

    // TEST 24 - creerFormation
    it('creerFormation appelle POST /formations avec le payload', async () => {
        const payload = { titre: 'Nouvelle formation', description: 'Desc test' };
        api.post.mockResolvedValue({ data: { id: 99, ...payload } });

        const result = await formationService.creerFormation(payload);

        expect(api.post).toHaveBeenCalledWith('/formations', payload);
        expect(result.id).toBe(99);
    });

    // TEST 25 - modifierFormation
    it('modifierFormation appelle PUT /formations/:id avec le payload', async () => {
        const payload = { titre: 'Titre modifie' };
        api.put.mockResolvedValue({ data: { id: 3, ...payload } });

        const result = await formationService.modifierFormation(3, payload);

        expect(api.put).toHaveBeenCalledWith('/formations/3', payload);
        expect(result.titre).toBe('Titre modifie');
    });

    // TEST 26 - supprimerFormation
    it('supprimerFormation appelle DELETE /formations/:id', async () => {
        api.delete.mockResolvedValue({ data: { message: 'Supprime' } });

        const result = await formationService.supprimerFormation(7);

        expect(api.delete).toHaveBeenCalledWith('/formations/7');
        expect(result.message).toBe('Supprime');
    });

    // TEST 27 - getFormation retourne null si API renvoie null
    it('getFormation gere une reponse vide de l API', async () => {
        api.get.mockResolvedValue({ data: null });

        const result = await formationService.getFormation(999);

        expect(api.get).toHaveBeenCalledWith('/formations/999');
        // La methode retourne directement response.data, ici null
        expect(result).toBeNull();
    });

});

// ── moduleService ────────────────────────────────────────────

describe('moduleService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // TEST 28 - getModules
    it('getModules appelle GET /formations/:id/modules', async () => {
        const modules = [
            { id: 1, titre: 'Introduction' },
            { id: 2, titre: 'Pratique' },
        ];
        api.get.mockResolvedValue({ data: modules });

        const result = await moduleService.getModules(10);

        expect(api.get).toHaveBeenCalledWith('/formations/10/modules');
        expect(result).toEqual(modules);
    });

    // TEST 29 - terminerModule
    it('terminerModule appelle POST /modules/:id/terminer', async () => {
        api.post.mockResolvedValue({ data: { success: true } });

        const result = await moduleService.terminerModule(42);

        expect(api.post).toHaveBeenCalledWith('/modules/42/terminer');
        expect(result.success).toBe(true);
    });

    // TEST 30 - creerModule (remplace getMesModulesTermines absent du projet)
    it('creerModule appelle POST /formations/:id/modules avec le payload', async () => {
        const payload = { titre: 'Nouveau module', contenu: 'Contenu test' };
        api.post.mockResolvedValue({ data: { id: 55, ...payload } });

        const result = await moduleService.creerModule(10, payload);

        expect(api.post).toHaveBeenCalledWith('/formations/10/modules', payload);
        expect(result.id).toBe(55);
    });

});
