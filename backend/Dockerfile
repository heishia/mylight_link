FROM node:20-alpine AS builder

WORKDIR /app

COPY database/ ./database/
COPY backend/package.json backend/package-lock.json ./backend/

WORKDIR /app/backend
RUN npm ci

RUN npx prisma generate --schema=../database/schema.prisma

COPY backend/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/database/ ./database/
COPY --from=builder /app/backend/node_modules/ ./backend/node_modules/
COPY --from=builder /app/backend/dist/ ./backend/dist/
COPY --from=builder /app/backend/package.json ./backend/

WORKDIR /app/backend

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy --schema=../database/schema.prisma && node dist/main"]
