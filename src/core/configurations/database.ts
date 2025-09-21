/* eslint @typescript-eslint/no-var-requires: "off" */
import { Dialect, Sequelize } from 'sequelize';
require('dotenv').config();

const db = {
  dialect: `${process.env.DB_DIALECT}`,
  database: `${process.env.DB_DATABASE}`,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT),
};

const dbDriver: Dialect = db.dialect as Dialect;
const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: dbDriver,
  define: {
    charset: 'utf8',
    collate: 'utf8_unicode_ci', 
    timestamps: true
  },
  timezone: '-03:00',
  logging: () => {
    //Log dummy in database
  },
});

sequelize.authenticate();

export { sequelize };
