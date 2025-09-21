import { CrudService } from '@src/core/helpers';
import { Client, IClient } from './client.model';
import { sequelize } from '@src/core/configurations';
import { Op, Transaction } from 'sequelize';
import { Address } from './address/address.model';
import addressService from './address/address.service';
import { Province } from './address/province.model';

class ClientsService extends CrudService<IClient> {
  
  constructor() {
    super(Client, 'clients-service');
  }

  public byId = async (id: number): Promise<IClient> => {
    return await Client.findByPk(id, {
      include: [
        { model: Address, as: 'address', include: [{model: Province, as: 'province'}] },
      ],
    });
  }

  protected verifyEmail = async (data: IClient): Promise<void> => {
    if (!data.id) {
      const where: any = {};
      if(data.email && data.phone) {
        where[Op.or] = [{ email: data.email }, { phone: data.phone }];
      } else {
        if (data.email) {
          where.email = data.email;
        }
        if(data.phone) {
          where.phone = data.phone;
        }
      }
     
      const verifyEmail = await Client.count({ where: { email: data.email} });
      if (verifyEmail > 0) {
        throw new Error('El cliente ya existe');
      }
    }
  };

  protected verifyDocument = async (data: IClient): Promise<void> => {
    if (!data.id) {
      const verifyDocument = await Client.count({ where: { document: data.document } });
      if (verifyDocument > 0) {
        throw new Error('El cliente con este número de documento ya existe');
      }
    }
  };

  public all = async (paginateRequest?: any): Promise<any> => {
    return await this.paginate(paginateRequest, {
      include: [
        { model: Address, as: 'address' },
      ],
      order: [['id', 'DESC']],
    });
  };

  public byDocument = async(document: string): Promise<IClient> => {
    return await Client.findOne({ where: { document } });
  }
  public byDocumentAndEmail = async(document: string, email: string): Promise<IClient> => {
    return await Client.findOne({ where: { [Op.or]: {document, email } } });
  }

  public createClient = async (data: any, transaction?: Transaction): Promise<IClient> => {
      
      data.documentType = data.documentType ?? 'DNI';
    
      await Promise.all([this.verifyEmail(data), this.verifyDocument(data)]);
      
      const address = await addressService.create(data.address, transaction);
      data.addressId = address.id;
      
      const client = await Client.create(data, { transaction });
      return client;
  };


  public remove = async(id: number): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error('Cliente no encontrado');
      }
      await client.destroy({ transaction });
      
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw (error);
    }
  }
}


export const clientsService = new ClientsService();
