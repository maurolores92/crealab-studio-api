FROM node:20
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgconf-2-4 \
    libgtk-3-0 \
    libnspr4 \
    libxss1 \
    lsb-release \
    xdg-utils \
    wget \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    libxrandr2 \
    libgbm-dev \
    libpango1.0-0 \
    xdg-utils \
    shared-mime-info

RUN npm i -g puppeteer

RUN mkdir -p /home/node/Downloads /app \
    && chown -R node:node /home/node \
    && chown -R node:node /app

WORKDIR /home/node/app
COPY package.json ./
USER node


RUN npm i
COPY --chown=node:node . .

RUN mkdir public/storage
RUN chown -R node:node public/storage

CMD ["npm", "start"]
