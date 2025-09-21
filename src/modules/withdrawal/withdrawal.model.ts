
import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { User } from '../users/users.model';

export interface IWithdrawal extends IModelBase {
  userId: number;
  amount: number;
  date: Date;
  description?: string;
  user?: typeof User;
}

const model = {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const Withdrawal: ModelStatic<IWithdrawal> = sequelize.define<IWithdrawal>(
  'Withdrawal',
  model,
  configDatabase
);

Withdrawal.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export { Withdrawal };
