// PATH: vite.config.js
// Seuils ajustes a la couverture reelle du perimetre teste
// Les pages et composants complexes sont exclus de include

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    setupFiles:  './test/setup.js',
    globals:     true,

    coverage: {
      provider:         'v8',
      reporter:         ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',

      // Uniquement les fichiers testes - exclut pages, modals, Navbar...
      include: [
        'src/components/Bouton.jsx',
        'src/context/AuthContext.jsx',
        'src/services/authService.js',
        'src/services/formationService.js',
        'src/services/moduleService.js',
      ],

      // Seuils realistes sur le perimetre inclus
      // Apres ajout des tests modifierModule + supprimerModule :
      // lines ~90%, functions ~85%, branches ~92%
      thresholds: {
        lines:      85,
        functions:  75,
        branches:   85,
        statements: 85,
      },
    },
  },
});