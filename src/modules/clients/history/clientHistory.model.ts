import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Client } from '../client.model';
import { IUser, User } from '@src/modules/users/users.model';

export interface IClientHistory extends IModelBase {
  clientId: number;
  title: string;
  description?: string;
  color?: string;
  userId: number;
  user?: IUser;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'primary'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
};

const ClientHistory: ModelStatic<IClientHistory> = sequelize.define<IClientHistory>(
  'ClientHistory',
  model,
  configDatabase
);

ClientHistory.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export { ClientHistory };
