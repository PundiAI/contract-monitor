FROM node:16.9.1

WORKDIR /app

COPY . /app

RUN yarn install

VOLUME [ "/app/config", "/app/.env", "/app/src/contracts/abis"]

CMD ["yarn", "start"]


