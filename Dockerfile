# ============================================================
# Dockerfile - SkillHub Frontend (React + Vite)
# Build multi-stage : builder → image de production légère
# ============================================================

# ── Stage 1 : Build de l'application ────────────────────────
FROM node:20-alpine AS builder

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copie uniquement les fichiers de dépendances en premier
# (optimise le cache Docker : rebuild seulement si package.json change)
COPY package*.json ./

# Installe les dépendances de production uniquement
RUN npm ci --frozen-lockfile

# Copie tout le code source
COPY . .

# Variable d'environnement injectée au build (peut être surchargée)
ARG VITE_API_URL=http://localhost:8001/api
ENV VITE_API_URL=$VITE_API_URL

# Build de production Vite → génère le dossier /app/dist
RUN npm run build

# ── Stage 2 : Serveur de production (Nginx) ─────────────────
FROM nginx:1.25-alpine AS production

# Copie la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie uniquement le build final depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose le port 80 (Nginx)
EXPOSE 80

# Healthcheck : vérifie que Nginx répond
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Démarre Nginx en mode foreground (obligatoire pour Docker)
CMD ["nginx", "-g", "daemon off;"]