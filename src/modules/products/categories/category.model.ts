import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

interface ICategory extends IModelBase {
  name: string;
  slug: string;
  icon?: string;
  status?: string;
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
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const Category: ModelStatic<ICategory> = sequelize.define<ICategory>(
  'Category',
  model,
  configDatabase
);


export { Category, ICategory };
