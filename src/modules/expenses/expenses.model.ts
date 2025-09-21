import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { User } from '../users/users.model';

interface IExpenses extends IModelBase {
    date: Date;
    description?: string;
    performedById?: number;
    amountTotal?: number;
    userId?: number;
}

const model = {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amountTotal: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: true,
    },
    performedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: User,
        key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: User,
        key: 'id',
        },
    },
};

const Expenses: ModelStatic<IExpenses> = sequelize.define<IExpenses>(
  'Expenses',
  model,
  configDatabase
);

Expenses.belongsTo(User, {as: 'user', foreignKey: 'userId'});
Expenses.belongsTo(User, {as: 'performedBy', foreignKey: 'performedById'});

export { Expenses, IExpenses };
