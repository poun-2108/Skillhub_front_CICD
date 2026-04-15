// PATH: test/setup.js

import '@testing-library/jest-dom';

// Nettoyage localStorage avant chaque test
beforeEach(() => {
    localStorage.clear();
});

// Mock window.location pour eviter les erreurs de redirection (axiosConfig 401)
Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '/' },
});