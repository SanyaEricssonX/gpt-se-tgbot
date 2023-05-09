FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install -g pm2

ENV PORT=3000

EXPOSE $PORT

VOLUME [ "/app/data/logs" ]

CMD ["pm2-runtime", "start", "pm2.config.json"]