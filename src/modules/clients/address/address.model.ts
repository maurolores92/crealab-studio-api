import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { IProvince, Province } from './province.model';

interface IAddress extends IModelBase {
  provinceId: number;
  city: string;
  address: string;
  door: string;
  postalCode: string;
  province?: IProvince;
}

const model = {
  provinceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Province,
      key: 'id',
    },
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  door: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const Address: ModelStatic<IAddress> = sequelize.define<IAddress>(
  'Address',
  model,
  configDatabase
);

Address.belongsTo(Province, {as: 'province', foreignKey: 'provinceId'});

Province.hasMany(Address, {as: 'addresses', foreignKey: 'provinceId'});

export { Address, IAddress };
