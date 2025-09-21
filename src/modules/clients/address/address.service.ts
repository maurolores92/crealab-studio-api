import { CrudService } from '@src/core/helpers';
import { Address, IAddress } from './address.model';

import { IProvince, Province } from './province.model';
import cacheService from '@src/core/cache/memory';

const CACHE_PROVINCES = 'provinces';

class AddressService extends CrudService<IAddress> {
  constructor() {
    super(Address, 'address-service');
  }
 
  public all = async(): Promise<IAddress[]> => {
    return Address.findAll();
  };

  public getProvinces = async(): Promise<IProvince[]> => {
    return cacheService.getOrSet<IProvince[]>(CACHE_PROVINCES, Province.findAll())
    // return Province.findAll();
  }
}

export default new AddressService();