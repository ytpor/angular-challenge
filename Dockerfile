# Stage 1: Build the Angular app
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG APP_ENVIRONMENT=production
RUN npm run build -- --configuration=${APP_ENVIRONMENT}

# Stage 2: Serve the app with Nginx
FROM nginx:1.29-alpine AS production
RUN apk add --no-cache gettext && \
    rm /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx
USER nginx
COPY --chown=nginx:nginx --from=build /app/dist/angular-challenge/browser /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
