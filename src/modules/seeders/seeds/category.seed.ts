import AbstractSeed from "./abstract.seed";
import { Category, ICategory } from "@src/modules/products/categories/category.model";

class CategorySeed extends AbstractSeed<ICategory> {
  protected data: any[] = [
    {
      name: 'Llaveros',
      slug: 'llaveros',
      status: 'active',
    },
    {
      name: 'Juguetes',
      slug: 'juguetes',
      status: 'active',
    },
    {
      name: 'Imanes',
      slug: 'imanes',
      status: 'active',
    },
    {
      name: 'Pins',
      slug: 'pins',
      status: 'active',
    },
    {
      name: 'Personajes',
      slug: 'personajes',
      status: 'active',
    },
  ];
  
  constructor() {
    super(Category, 'CategorySeed')
  }
}

export default new CategorySeed();
