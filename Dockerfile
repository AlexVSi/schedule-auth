FROM node:lts

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8888
ENTRYPOINT [ "npm", "run", "build" ]
