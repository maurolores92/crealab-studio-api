import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

interface IProvince extends IModelBase {
  name: string;
}

const model = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Province: ModelStatic<IProvince> = sequelize.define<IProvince>(
  'Province',
  model,
  configDatabase
);


export { Province, IProvince };
