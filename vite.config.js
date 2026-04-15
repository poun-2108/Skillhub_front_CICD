// PATH: vite.config.js (racine du projet) modifier

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

      // Uniquement les fichiers couverts par les tests
      include: [
        'src/components/Bouton.jsx',
        'src/context/AuthContext.jsx',
        'src/services/authService.js',
        'src/services/formationService.js',
        'src/services/moduleService.js',
      ],

      thresholds: {
        lines:      85,
        functions:  75,
        branches:   85,
        statements: 85,
      },
    },
  },
});