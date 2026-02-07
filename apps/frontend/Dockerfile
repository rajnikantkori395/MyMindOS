# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files from root (build context is root)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/frontend/tsconfig.json ./apps/frontend/
COPY apps/frontend/next.config.ts ./apps/frontend/

# Install dependencies
WORKDIR /app/apps/frontend
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/frontend ./

# Build Next.js app
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files from root
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

# Install production dependencies only
WORKDIR /app/apps/frontend
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/next.config.ts ./

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["pnpm", "start"]
