import { Model } from 'sequelize';

export interface IModelBase extends Model {
  id: number;
  createdAt: Date;
  updateAt: Date;
}

const configDatabase = {
  underscored: true,
};

export interface IPaginateRequest {
  page: number;
  pageSize: number
}

export interface IPaginate<T> {
  currentPage: number;
  data: T[],
  totalPages: number;
  totalRecords: number;
}

export { configDatabase };

