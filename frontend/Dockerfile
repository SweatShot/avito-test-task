FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

RUN npm install
RUN npm run build

FROM nginx:stable

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
