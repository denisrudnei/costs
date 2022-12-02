FROM node:latest

WORKDIR /opt/costs

COPY ./ ./

RUN apt-get update
RUN apt-get install g++ build-essential -yf

RUN npm install --legacy-peer-deps

RUN npm run build-server

CMD ["npm start"]
