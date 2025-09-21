
import { IProductStatus, ProductStatus } from "@src/modules/products/status/productStatus.model";
import AbstractSeed from "./abstract.seed";

class ProductStatusSeed extends AbstractSeed<IProductStatus> {
  protected data: any[] = [
    {
      name: 'Borrador',
      slug: 'draft',
    },
    {
      name: 'Publicado',
      slug: 'published',
    },
    {
      name: 'Inactivo',
      slug: 'disabled',
    },
  ];

  constructor() {
    super(ProductStatus, 'ProductStatusSeed')
  }
}

export default new ProductStatusSeed();
