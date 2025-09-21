import { sequelize } from '@src/core/configurations';
import { IStockDistribution, StockDistribution } from './stockDistribution.model';
import { CrudService } from '@src/core/helpers';
import { ProductHistory } from '../history/productHistory.model';
import Context from '@src/core/middleware/context';
import { Products } from '../products.model';

class StockDistributionService extends CrudService<IStockDistribution> {
  constructor() {
    super(StockDistribution, 'stock-distribution-service');
  }
  public addStock = async(data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Products.findByPk(data.productId);
      console.log('Encontro el producto')
      if(product.stock === 0) {
        product.set('cost', Number(data.cost));
      }
      product.set('stock', Number(product.stock) + Number(data.stock));
      await product.save({transaction});
      console.log('Creo el producto')
      await StockDistribution.create({
        productId: Number(data.productId), 
        stock: data.stock,
        cost: data.cost,
        status: 'pending',
      }, {transaction});
      console.log('Creo el stock distribution')
      
      await ProductHistory.create({
        title: 'Stock agregado',
        description: `Se hán cargado ${data.stock} items al producto.`,
        color: 'warning',
        productId: Number(data.productId), 
        userId: Context.userId,
      }, {transaction});
      console.log('Creo el history');
      await transaction.commit();
      console.log('hizo el commit')
      return {message: 'Se ha cargado con éxito el stock.'};
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw error;
    }
  }
  
}

export const stockDistributionService = new StockDistributionService();
