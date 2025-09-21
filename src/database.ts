import { sequelize } from './core/configurations/database';

sequelize.sync({ force: false, alter: true });