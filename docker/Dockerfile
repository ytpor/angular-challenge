# Stage 1: Build the Angular app
FROM node:24 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.29.0-alpine
COPY --from=build /app/dist/angular-challenge/browser /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
