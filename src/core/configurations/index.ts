/* eslint @typescript-eslint/no-var-requires: "off" */
require('dotenv').config();

export * from './database';

export const app = {
  port: Number(process.env.PORT),
};

export const env = {
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_SECRET_TOKEN,
  appUrl: process.env.APP_URL_BASE,
  puppeteerExecutablePath: process.env.PUPPETEER_EXEC_PATH
};

export const sentry = {
  dns:  process.env.SENTRY_URL + '/' + process.env.SENTRY_ID,
  rate: Number(process.env.SENTRY_RATE),
  environment:  process.env.SENTRY_ENVIRINMENT,
};

export const mail = {
  driver: process.env.MAIL_DRIVER,
  host: process.env.MAIL_HOST,
  from: process.env.MAIL_FROM,
  port: Number(process.env.MAIL_PORT),
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  encription: process.env.MAIL_ENCRYPTION,
  enableStartTTLSAuto: Boolean(process.env.MAIL_ENABLE__STARTTLS_AUTO),
};