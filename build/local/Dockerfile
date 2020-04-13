FROM node:12.16.1-alpine

WORKDIR /app

COPY package.json app/package.json
COPY build/local/run.sh /run.sh

CMD ["/run.sh"]
