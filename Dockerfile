FROM node:alpine

WORKDIR /usr/applications

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD [ "npm", "start" ]
