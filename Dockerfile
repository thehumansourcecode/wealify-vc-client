FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG MODE 

ENV NUXT_UI_PRO_LICENSE "CA641533-B3AD-4BB5-BBF5-DD62A86257F2"

EXPOSE 3000

RUN npm run build-${MODE}
CMD [ "npm", "run", "start" ]