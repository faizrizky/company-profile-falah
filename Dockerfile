# syntax=docker/dockerfile:1

# Falah website (landing page) as a container. Built and run by the
# `falah-deploy` project (docker compose); not meant to be run on its own.
#
# Build arguments are values Next.js bakes into the build (the CSP, the image
# allow-list and the /media proxy). Changing one means rebuilding the image.
# CMS_URL is not one of them: it is read when the container runs.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ── dependencies ─────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ── build ────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The CMS as browsers see it (the visual editor talks to it directly).
ARG CMS_PUBLIC_URL
# Where CMS media comes from: the public bucket / CDN URL, or the internal URL
# of the bucket when /media is proxied (falah-deploy/.env.example explains).
ARG CMS_MEDIA_URL

# No CMS_URL on purpose: the build must not depend on the CMS being up. Pages
# are then rendered on demand and cached as visitors arrive.
RUN NODE_ENV=production \
    BUILD_STANDALONE=true \
    NEXT_TELEMETRY_DISABLED=1 \
    CMS_PUBLIC_URL="${CMS_PUBLIC_URL:-}" \
    CMS_MEDIA_URL="${CMS_MEDIA_URL:-}" \
    npm run build

# ── run ──────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Only checks that the server answers; it does not depend on the CMS.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD nc -z 127.0.0.1 3000 || exit 1

CMD ["node", "server.js"]
