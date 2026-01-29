# ==================================
# Stage 1: Build
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3, bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to dist/
RUN npm run build

# ==================================
# Stage 2: Production
# ==================================
FROM node:20-alpine AS production

WORKDIR /app

# Install runtime dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev && \
    # Clean up build tools after native module compilation
    apk del python3 make g++ && \
    # Clean npm cache
    npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy migrations and seeds (needed for db:init)
COPY --from=builder /app/persistence/migrations ./persistence/migrations
COPY --from=builder /app/persistence/seeds ./persistence/seeds

# Create directory for database (will be mounted as volume in production)
RUN mkdir -p /data

# Environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0
ENV DB_PATH=/data/app.sqlite

# Expose port (Render will set PORT via env)
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Start server
CMD ["node", "dist/server.js"]
