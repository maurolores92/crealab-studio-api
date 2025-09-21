import { NextFunction, Response, Request } from 'express';
import { CrudController } from '@src/core/helpers';
import addressService from './address.service';
import { IAddress } from './address.model';

class AddressController extends CrudController<IAddress> {
  constructor() {
    super(addressService, 'address-controller');
  }
  public getProvinces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provinces: any[] = await addressService.getProvinces();
      res.status(200).json(provinces);
    } catch (error) {
      next(error);
    }
  }
} 
export default new AddressController();
