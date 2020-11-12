FROM node:14.15.0-buster-slim

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./   ./

EXPOSE 8080

CMD ["npm","start"]

