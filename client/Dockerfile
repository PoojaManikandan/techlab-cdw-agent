# Step 1: Build the React app
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Replace default nginx.conf with custom one (to use port 3000)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 3000
EXPOSE 3000

ENTRYPOINT [ "sh", "/entrypoint.sh" ]