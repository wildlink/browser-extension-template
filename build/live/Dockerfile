FROM node:12.16.1-alpine

RUN yarn global add bestzip

WORKDIR /app

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY .env.development /app/.env.development
COPY .env.production /app/.env.production
COPY src /app/src
COPY zip.sh /app/zip.sh

RUN yarn install --prod

CMD ["yarn", "build"]
