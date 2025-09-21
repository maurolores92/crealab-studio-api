import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

export interface IPaymentMethod extends IModelBase {
  id: number;
  name: string;
  slug: string;
}

const model = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const PaymentMethod: ModelStatic<IPaymentMethod> = sequelize.define<IPaymentMethod>(
  'PaymentMethod',
  model,
  configDatabase
);


export { PaymentMethod };

