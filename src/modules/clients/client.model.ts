import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

import { Address, IAddress } from './address/address.model';

export type DocumentType = 'DNI' | 'CUIT' | 'CUIL';

interface IClient extends IModelBase {
  id: number;
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  documentType: DocumentType;
  taxCondition: string;
  document: string;
  company?: string;
  addressId?: number;
  notes?: string;
  address?: IAddress;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxCondition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Address,
      key: 'id',
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
};

const Client: ModelStatic<IClient> = sequelize.define<IClient>(
  'Client',
  model,
  configDatabase
);

Client.belongsTo(Address, { as: 'address', foreignKey: 'addressId' });

Address.hasMany(Client, {as: 'clients'});


export { Client, IClient };
