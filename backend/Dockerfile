# ==================================
# Stage 1: Build
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


# ==================================
# Stage 2: Production
# ==================================
FROM node:20-alpine

WORKDIR /app

# Solo runtime deps (libstdc++ suele ser suficiente)
RUN apk add --no-cache libstdc++

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/persistence ./persistence

# Copy and setup entrypoint (runs migrations + seeds + server)
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=4000
ENV DB_PATH=/data/app.sqlite

EXPOSE 4000
ENTRYPOINT ["./entrypoint.sh"]
