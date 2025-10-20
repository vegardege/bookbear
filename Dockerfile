# Base stage
FROM node:25-alpine AS base
WORKDIR /app

# Install dependencies into temp directories
FROM base AS install
RUN mkdir -p /tmp/dev
COPY package.json package-lock.json /tmp/dev/
RUN cd /tmp/dev && npm ci

RUN mkdir -p /tmp/prod
COPY package.json package-lock.json /tmp/prod/
RUN cd /tmp/prod && npm ci --only=production

# Build stage
FROM base AS builder
COPY --from=install /tmp/dev/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM base AS runner

ENV NODE_ENV=production

COPY --from=install /tmp/prod/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create data directory for volume mount
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npm", "start"]
