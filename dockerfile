FROM node:17.8

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]