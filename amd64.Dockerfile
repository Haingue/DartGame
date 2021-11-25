# Build application
FROM node:12-buster as builder

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app
RUN npm run build

# Run application
# FROM node:lts-alpine
# EXPOSE 80
# COPY --from=builder /app/dist /var/www/html
FROM httpd:2.4
EXPOSE 80
COPY --from=builder /app/dist /usr/local/apache2/htdocs/