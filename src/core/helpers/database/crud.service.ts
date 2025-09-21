import { Model, ModelStatic, QueryTypes, Transaction, WhereOptions } from 'sequelize';
import { sequelize } from '../../configurations';

import { DatabaseException } from '@src/core/exceptions/database.exception';
import { IPaginate, IPaginateRequest } from './base.model';

export abstract class CrudService<T extends Model> {
  constructor(readonly model: ModelStatic<T>, readonly serviceName: string) { }

  protected preCreate = async (data: T, transaction?: Transaction): Promise<void> => {
    //
  };
  protected postCreate = async (data: T, transaction?: Transaction): Promise<void> => {
    //
  };
  protected postUpdate = async (transaction?: Transaction): Promise<void> => {
    //
  };

  public all = async (paginateRequest: any = null): Promise<T[]> => {
    try {
      const where: WhereOptions = { };
      return await this.model.findAll({ where, raw: true });
    } catch (error) {
      console.error(`${this.serviceName} - all`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };
  public paginate = async (request: IPaginateRequest, configuration: any = {}): Promise<IPaginate<T>> => {
    try {
      const limit = Number(request.pageSize);
      const offset = Number(request.page) * limit;
      const result = await this.model.findAndCountAll({
        offset,
        limit,
        ...configuration
      });
      const totalPages = Math.ceil(result.count / request.pageSize);
    
      return {
        totalPages,
        currentPage: Number(request.page),
        totalRecords: result.count,
        data: result.rows
      };
    } catch (error) {
      console.error(`${this.serviceName} - paginate`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public find = async (where: WhereOptions): Promise<T[]> => {
    try {
      return await this.model.findAll({ where, raw: true });
    } catch (error) {
      console.error(`${this.serviceName} - find`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public byId = async (id: number): Promise<T> => {
    try {
      return await this.model.findByPk(id, { raw: true });
    } catch (error) {
      console.error(`${this.serviceName} - byId`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public getOne = async (query: any): Promise<T> => {
    try {
      return await this.model.findOne({ raw: true, ...query });
    } catch (error) {
      console.error(`${this.serviceName} - getOne`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public create = async (data: any, transaction?: Transaction): Promise<T> => {
    try {
      await this.preCreate(data, transaction);
      const result = await this.model.create(data, {transaction});
      await this.postCreate(result, transaction);
      
      return result;
    } catch (error) {
      console.error(`${this.serviceName} - create`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public remove = async (id: number): Promise<any> => {
    try {
      const data = await this.model.findByPk(id);
      return await data.destroy();
    } catch (error) {
      console.error(`${this.serviceName} - remove`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public update = async (id: number, newData: any, transaction?: Transaction): Promise<any> => {
    try {
      const data = await this.model.findByPk(id);
      await this.preCreate(newData, transaction);
      data.set(newData);
      await data.save({transaction});
      await this.postUpdate(transaction);
      return data;
    } catch (error) {
      console.error(`${this.serviceName} - update`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };

  public bulkCreate = async (data: any[]): Promise<any[]> => {
    try {
      const result = await this.model.bulkCreate(data, {
        ignoreDuplicates: true,
      });
      return result.map(r => r.get({ plain: true }));
    } catch (error) {
      console.error(`${this.serviceName} - bulkCreate`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };
  public deleteAll = async (): Promise<void> => {
    try {
      await this.model.destroy({ where: {} });
    } catch (error) {
      console.error(`${this.serviceName} - deleteAll`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  }
  public query = async (query: string): Promise<T[]> => {
    try {
      return await sequelize.query(query, { type: QueryTypes.SELECT });
    } catch (error) {
      console.error(`${this.serviceName} - raw query`, error.message);
      throw new DatabaseException(error.message, this.serviceName);
    }
  };
}
