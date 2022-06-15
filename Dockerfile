
FROM node:16.15-alpine as node_base

WORKDIR /app


COPY auth /app/auth
COPY movie /app/movie

