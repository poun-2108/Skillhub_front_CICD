// PATH: test/setup.js
// Configuration globale Vitest
// On utilise le localStorage natif de jsdom (pas de mock custom)
// pour eviter les conflits avec les modules qui cachent la reference

import '@testing-library/jest-dom';

// Nettoyage du localStorage jsdom natif avant chaque test
beforeEach(() => {
    localStorage.clear();
});

// Mock window.location pour eviter les erreurs de redirection
// axiosConfig appelle window.location.href = '/' sur les erreurs 401
Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '/' },
});