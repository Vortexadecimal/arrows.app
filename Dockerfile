# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# node-gyp requires Python + build tools (needed by @parcel/watcher)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# ── Install root workspace dependencies first (nx, etc.) ──────────────────────
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Copy monorepo source ──────────────────────────────────────────────────────
COPY . .

# ── Install app-level dependencies ────────────────────────────────────────────
WORKDIR /app/apps/arrows-app
RUN npm install --legacy-peer-deps

# ── Build via Vite directly (bypasses nx-cloud which needs network access) ────
# Output goes to ../../dist/apps/arrows-app (relative to app dir = /app/dist/apps/arrows-app)
RUN npx vite build

# ─── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist/apps/arrows-app /usr/share/nginx/html

# Nginx config: serve SPA with pushState routing support
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
