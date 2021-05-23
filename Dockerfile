# stage 1
FROM node:alpine AS ci-ui
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# stage 2
FROM nginx:alpine
COPY --from=ci-ui /app/dist/ci-ui /usr/share/nginx/html
EXPOSE 80
