# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Update these paths to include the 'frontend/' prefix
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci

# Update this to copy the frontend folder
COPY frontend/ .

# Build the project
RUN npm run build

# Run Stage
FROM nginx:alpine

# Copy build artifacts to Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle SPA routing (if any)
# We will create a simple inline config or default to standard one, 
# but for SPA we usually need to redirect 404 to index.html.
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
