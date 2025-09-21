import AbstractSeed from "./abstract.seed";
import { Category, ICategory } from "@src/modules/products/categories/category.model";

class CategorySeed extends AbstractSeed<ICategory> {
  protected data: any[] = [
    {
      name: 'Remera',
      slug: 'remera',
      status: 'active',
    },
    {
      name: 'Pantalón',
      slug: 'pantalon',
      status: 'active',
    },
    {
      name: 'Buzo',
      slug: 'buzo',
      status: 'active',
    },
    {
      name: 'Campera',
      slug: 'campera',
      status: 'active',
    },
    {
      name: 'Pijama',
      slug: 'pijama',
      status: 'active',
    },
  ];
  
  constructor() {
    super(Category, 'CategorySeed')
  }
}

export default new CategorySeed();
