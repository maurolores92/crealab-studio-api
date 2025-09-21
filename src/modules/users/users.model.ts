import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { IRole, Role } from './role/roles.model';


export interface IUser extends IModelBase {
  name: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  photo: string;
  roleId: number;
  role?: IRole;
}

const model = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
};

const User: ModelStatic<IUser> = sequelize.define<IUser>(
  'User',
  model,
  configDatabase
);

User.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });

export { User };
