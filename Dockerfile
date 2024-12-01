# Build stage
FROM node:23-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:23-slim AS runner

ENV NODE_ENV=production

WORKDIR /app
RUN mkdir -p /app/data

COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
