# Build application
FROM node:12-buster as builder

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app
RUN npm run build

# Run application
FROM arm64v8/httpd
EXPOSE 80
COPY --from=builder /app/dist /usr/local/apache2/htdocs/