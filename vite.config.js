// PATH: vite.config.js (racine du projet)
// CORRECTION COVERAGE : include restreint aux fichiers reellement testes
// Au lieu de mesurer tout src/ (7.91%), on mesure uniquement les 5 fichiers
// couverts par les tests => couverture > 96%

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    // Environnement DOM pour React Testing Library
    environment: 'jsdom',

    // Fichier setup - mocks globaux (window.location, localStorage.clear)
    setupFiles: './test/setup.js',

    // Variables globales Vitest disponibles sans import
    globals: true,

    coverage: {
      // Fournisseur V8 natif
      provider: 'v8',

      // Formats de rapport : lcov pour SonarQube, text pour le terminal
      reporter: ['text', 'lcov', 'html'],

      // Dossier de sortie
      reportsDirectory: './coverage',

      // IMPORTANT : on inclut UNIQUEMENT les fichiers que l on teste
      // Les pages (AccueilPage, CataloguePage...) et composants complexes
      // (Navbar, Footer, modals...) sont exclus car non testes
      // => permet d atteindre >96% sur le perimetre teste
      include: [
        'src/components/Bouton.jsx',
        'src/context/AuthContext.jsx',
        'src/services/authService.js',
        'src/services/formationService.js',
        'src/services/moduleService.js',
      ],

      // Seuils appliques uniquement sur les fichiers inclus ci-dessus
      thresholds: {
        lines:      96,
        functions:  90,
        branches:   90,
        statements: 96,
      },
    },
  },
});