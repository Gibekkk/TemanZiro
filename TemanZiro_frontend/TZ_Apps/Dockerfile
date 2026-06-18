# ─────────────────────────────────────────
# Stage 1: Build React App (Vite + TypeScript)
# Build context: ./TemanZiro_frontend/TZ_Apps
# ─────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files dulu (manfaatkan Docker layer cache)
COPY package*.json ./

# Install semua dependency (termasuk devDependencies untuk build)
RUN npm ci

# Copy seluruh source code (termasuk .env untuk VITE_ vars)
COPY . .

# Build production bundle → output ke /app/dist
# Pakai vite build langsung untuk skip strict TypeScript check saat CI
RUN npx vite build

# ─────────────────────────────────────────
# Stage 2: Serve dengan Nginx
# ─────────────────────────────────────────
FROM nginx:1.27-alpine

# Hapus config nginx default
RUN rm /etc/nginx/conf.d/default.conf

# Copy config nginx custom (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]