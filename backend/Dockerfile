FROM node:18

WORKDIR /src

COPY ./package*.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["pnpm", "start"]