import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';


export interface IRole extends IModelBase {
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

const Role: ModelStatic<IRole> = sequelize.define<IRole>(
  'Role',
  model,
  configDatabase
);

export { Role };
