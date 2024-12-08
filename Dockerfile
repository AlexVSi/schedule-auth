FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install -g typescript

COPY . .

RUN npx prisma generate

EXPOSE 8888
ENTRYPOINT [ "npm", "run", "build" ]
