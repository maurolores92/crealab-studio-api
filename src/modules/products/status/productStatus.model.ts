import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';


interface IProductStatus extends IModelBase {
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

const ProductStatus: ModelStatic<IProductStatus> = sequelize.define<IProductStatus>(
  'ProductStatus',
  model,
  configDatabase
);

export { ProductStatus, IProductStatus };
