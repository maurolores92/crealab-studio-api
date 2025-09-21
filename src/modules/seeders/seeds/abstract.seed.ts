import { DatabaseException } from "@src/core/exceptions";
import { Model, ModelStatic, Transaction } from "sequelize";

export interface ISeed {
  create(transaction: Transaction): Promise<void>;
}

class AbstractSeed<T extends Model> implements ISeed {
  protected data: any[];
  constructor(readonly model: ModelStatic<T>, readonly serviceName: string) { }

  public create = async (transaction: Transaction): Promise<void> => {
    try {
      const promises = this.data.map(
        async (item: any) => this.model.create(item, { transaction })
      );
      await Promise.all(promises);
    } catch (error) {
      throw new DatabaseException(error.message, this.serviceName);
    }
  }

}

export default AbstractSeed;
