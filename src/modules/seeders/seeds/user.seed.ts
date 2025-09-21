import { IUser, User } from "@src/modules/users/users.model";
import AbstractSeed from "./abstract.seed";
import { Transaction } from "sequelize";
import { DatabaseException } from "@src/core/exceptions";
import { authServiceHelper } from "@src/core/helpers";

class UserSeed extends AbstractSeed<IUser> {
  data: any[] = [
    { 
      name: 'Super', 
      lastName: 'admin', 
      username: 'superadmin',
      email: 'superadmin@crealab.ar',
      newPassword: 'crealab2025',
      roleId: 1,
    },
  ];
  
  constructor() {
    super(User, 'user-seed');
  }

  public create = async (transaction: Transaction): Promise<void> => {
    try {
      const promises = this.data.map(
        async (item: any) => {
          item.password = await authServiceHelper.passwordEncrypt(item.newPassword)
          return this.model.create(item, { transaction })
        }
      );
      await Promise.all(promises);
    } catch (error) {
      throw new DatabaseException(error.message, this.serviceName);
    }
  };
}

export default new UserSeed();
