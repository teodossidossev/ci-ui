# stage 1: build the Angular app
FROM node:14-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# stage 2: serve the static bundle
FROM nginx:1.25-alpine
COPY --from=build /app/dist/ci-ui /usr/share/nginx/html
EXPOSE 80
