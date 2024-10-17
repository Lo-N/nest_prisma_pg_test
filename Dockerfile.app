FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY ["src", "prisma", ".env", "./"]

EXPOSE 3000

CMD [  "npm", "run", "start:migrate:dev" ]
