# Dockerfile multi-étapes pour frontend Qwik + backend Bun

# Stage 1: Build dependencies et applications
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copier les package.json
COPY package.json bun.lockb* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Installer les dépendances
RUN bun install --frozen-lockfile

# Copier le code source
COPY . .

# Build le frontend Qwik
WORKDIR /app/frontend
RUN bun run build

# Build le backend en exécutable
WORKDIR /app/backend
RUN bun build --compile --minify --sourcemap ./src/index.ts --outfile=backend

# Stage 2: Image de production Alpine légère
FROM alpine:3.19 AS runtime

# Installer les dépendances système nécessaires
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    tini

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001

# Créer les répertoires
RUN mkdir -p /app/frontend /app/backend && \
    chown -R appuser:appgroup /app

USER appuser

WORKDIR /app

# Copier les builds depuis l'étape précédente
COPY --from=builder --chown=appuser:appgroup /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=appuser:appgroup /app/frontend/server ./frontend/server
COPY --from=builder --chown=appuser:appgroup /app/backend/backend ./backend/

# Copier les fichiers de configuration nécessaires
COPY --from=builder --chown=appuser:appgroup /app/frontend/package.json ./frontend/
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

# Exposer les ports
EXPOSE 3000 8000

# Utiliser tini comme init
ENTRYPOINT ["/sbin/tini", "--"]

# Script de démarrage pour lancer les deux services
CMD ["sh", "-c", "cd /app/backend && ./backend & cd /app/frontend && bun run serve & wait"]