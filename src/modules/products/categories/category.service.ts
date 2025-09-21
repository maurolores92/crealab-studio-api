import slugify from 'slugify';
import { CrudService } from '@src/core/helpers';
import cacheService from '@src/core/cache/memory';
import { Category, ICategory } from './category.model';
import { IPaginate, IPaginateRequest } from '@src/core/helpers/database/base.model';
import { ProductCategory } from '../poductCategory.model';

const CACHE_KEY = 'categories';

class CategoryService extends CrudService<ICategory> {
  constructor() {
    super(Category, 'Category-service');
  }

  public actives = async(): Promise<ICategory[]> => {
  
    const categoriesPromise = Category.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'slug'],
    });

    const categories = await cacheService.getOrSet<ICategory[]>(CACHE_KEY, categoriesPromise);

    return categories;
  }

  public getAllWithProducts = async(): Promise<ICategory[]> => {
    const categoriesPromise = Category.findAll({
      include: [
        {
          model: ProductCategory,
          as: 'products',
          attributes: ['id']
        }
      ],
      where: { status: 'active' },
      attributes: ['id', 'name', 'slug'],
    });

    const categories = await cacheService.getOrSet<ICategory[]>(CACHE_KEY + '_products', categoriesPromise);
    
    return categories;
  }

  public getAll = async(paginateRequest: IPaginateRequest): Promise<IPaginate<ICategory>> => {
    return this.paginate(paginateRequest, {
      include: [
        {
          model: ProductCategory,
          as: 'products',
          attributes: ['id']
        }
      ]
    });
  };

  public preCreate = async (data: ICategory): Promise<void> => {
    data.slug = slugify(data.name, { lower: true, replacement: '_' });
    data.status = 'active';
  }

  public postCreate= async (data: ICategory): Promise<void> => {
    cacheService.delete(CACHE_KEY);
  }
}

export const categoryService = new CategoryService();