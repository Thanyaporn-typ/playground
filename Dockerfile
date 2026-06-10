# Build stage
FROM public.ecr.aws/docker/library/node:24-alpine AS builder

# Define build arguments early
# ARG VUE_APP_API
# ARG VUE_SET_API

# Set environment variables
# ENV VUE_APP_API=$VUE_APP_API
# ENV VUE_SET_API=$VUE_SET_API

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory and ownership
WORKDIR /app
RUN chown appuser:appgroup /app

# Switch to non-root user
USER appuser

# Copy package files first
COPY --chown=appuser:appgroup package.json package-lock.json ./

# Install ALL dependencies (including devDependencies) for build
RUN npm ci --no-audit --progress=false

# Copy source files
COPY --chown=appuser:appgroup . .

# Print environment variables for debugging
# RUN echo "Build time VUE_APP_API: $VUE_APP_API"
# RUN echo "Build time VUE_SET_API: $VUE_SET_API"

# Build the application
RUN npm run build

# Production stage
FROM node:lts-alpine

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install http-server with security considerations
RUN npm install -g http-server && npm cache clean --force

# Set working directory
WORKDIR /app

# Switch to non-root user
USER appuser

# Copy only the built files from builder stage
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080", "--cors", "--no-dotfiles", "--proxy", "http://localhost:8080?"]
