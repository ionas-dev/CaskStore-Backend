FROM node:17.8

RUN PORT=$PORT

WORKDIR /app

COPY ["./package.json", "./package-lock.json", "./"]
RUN npm install

COPY . . 

RUN npx prisma generate

CMD ["npm", "start"]