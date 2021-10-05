# build stage
FROM node:lts-alpine as build-stage
COPY ./client/package*.json ./
RUN npm install
COPY ./client/ .
RUN npm run test
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm -rf /usr/share/nginx/html/* && mkdir /usr/share/nginx/html/todo
COPY --from=build-stage /dist /usr/share/nginx/html/todo
COPY --from=build-stage /public /usr/share/nginx/html/todo/assets
COPY ./client/nginx/todo.conf /temp/todo.conf
COPY ./client/nginx/nginx.conf /etc/nginx/nginx.conf
RUN envsubst /app < /temp/todo.conf > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]