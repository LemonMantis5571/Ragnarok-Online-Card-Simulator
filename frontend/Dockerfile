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
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Run Stage
FROM nginx:alpine

# Copy build artifacts to Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

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
