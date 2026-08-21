FROM node:22-alpine3.21 AS deps

RUN apk add --no-cache libvips
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


FROM node:22-alpine3.21 AS builder
WORKDIR /app
RUN apk add --no-cache libvips
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image - Debian-based runtime for better native module compatibility
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends libvips && \
  addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 -G nodejs nextjs && \
  rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public

RUN mkdir -p .prisma
RUN chown -R nextjs:nodejs .prisma

RUN mkdir .next
RUN mkdir logs
RUN chown -R nextjs:nodejs .next logs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Reinstall native modules for Debian/glibc runtime
# sharp built on Alpine (musl) won't load on Debian (glibc)
COPY --from=builder /app/package.json ./package.json
RUN npm ci --omit=dev && npm rebuild sharp && rm package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
