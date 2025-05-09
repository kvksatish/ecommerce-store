# # Build stage
# FROM node:18-alpine AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm ci

# # Copy the rest of the application source code
# COPY . .

# # Build the Next.js application
# RUN npm run build

# # Production stage
# FROM node:18-alpine AS runner

# WORKDIR /app

# # Copy the built application and necessary files from the builder stage
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/node_modules ./node_modules

# # Set environment variables for production
# ENV NODE_ENV=production
# ENV PORT=3000

# # Expose the application port
# EXPOSE 3000

# # Command to start the application
# # Dockerfile
# CMD ["node", "server.js"]

# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS runner

WORKDIR /app

# Copy from standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# ✅ Run the standalone server
CMD ["node", "server.js"]