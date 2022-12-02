FROM node:latest

WORKDIR /opt/costs

COPY ./ ./

RUN npm install --legacy-peer-deps

RUN npm run build-server

CMD ["npm start"]
