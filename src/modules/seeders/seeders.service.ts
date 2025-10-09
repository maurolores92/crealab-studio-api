import { sequelize } from "@src/core/configurations";
import { DatabaseException } from "@src/core/exceptions";
import { ISeed } from "./seeds/abstract.seed";

import roleSeed from "./seeds/role.seed";
import userSeed from "./seeds/user.seed";
import orderStatusSeed from "./seeds/orderStatus.seed";
import productStatusSeed from "./seeds/productStatus.seed";
import provinceSeed from "./seeds/province.seed";
import paymentMethodSeed from "./seeds/paymentMethod.seed";

class SeedersService {

  private models: {[key:string]: ISeed} = {
    'role': roleSeed,
    'user': userSeed,
    'orderStatus': orderStatusSeed,
    'productStatus': productStatusSeed,
    'province': provinceSeed,
    'paymentMethod': paymentMethodSeed,
  };

  public seedOne = async (model: string): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const modelSeed = this.models[model];
      if(!modelSeed) {
        throw new Error(`Model ${model} not found`);
      }
      await modelSeed.create(transaction);
      await transaction.commit();
      return { message: 'Seeds executed' };
    } catch (error) {
      await transaction.rollback();
      console.error('SeedersService - seedOne', error.message);
      throw new DatabaseException(error.message, 'SeedersService');
    }
  }

  public async seed(): Promise<any> {
    const transaction = await sequelize.transaction();
    try {
      const promises = Object.keys(this.models).map(
        async (model: string) => this.models[model].create(transaction)
      );
      await Promise.all(promises);
      await transaction.commit();
      return { message: 'Seeds executed' };
    } catch (error) {
      await transaction.rollback();
      console.error('SeedersService - seed', error.message);
      throw new DatabaseException(error.message, 'SeedersService');
    }
  }
}

export default new SeedersService();
