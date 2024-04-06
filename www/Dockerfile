FROM node:alpine

RUN mkdir -p /app/www

COPY . /app/www/

WORKDIR /app/www

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]