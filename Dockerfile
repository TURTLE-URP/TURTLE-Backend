ARG nodeImageTag=24.15.0
ARG workingDirectory=/usr/src/app
# ==========================================
# Stage 1: Base (Complete installation of dependencies)
# ==========================================
FROM node:${nodeImageTag} AS base
ARG workingDirectory
WORKDIR ${workingDirectory}
COPY package*.json ./
RUN npm ci
RUN npm cache clean --force

# ==========================================
# Stage 2: Development (To code locally)
# ==========================================
FROM base AS development
COPY . .
RUN npx prisma generate
ENTRYPOINT [ "npm", "run", "start:dev" ]

# ==========================================
# Stage 3: Production Builder
# ==========================================
FROM base AS builder
COPY . .
RUN npx prisma generate
# Compile TypeScript to native JavaScript
RUN npm run build
# Eliminate dev dependencies to free space
RUN npm prune --production

# ==========================================
# Stage 4: Production Runtime
# ==========================================
FROM node:${nodeImageTag} AS production
ARG workingDirectory
ENV NODE_ENV=production
WORKDIR ${workingDirectory}
COPY --from=builder ${workingDirectory}/node_modules ./node_modules
COPY --from=builder ${workingDirectory}/dist ./dist
COPY --from=builder ${workingDirectory}/package*.json ./
ENTRYPOINT [ "node", "dist/main.js" ]