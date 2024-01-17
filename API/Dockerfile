FROM node:18.18.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN mkdir -p /usr/src/app/public

RUN npm install

COPY . .

COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]