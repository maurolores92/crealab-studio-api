import { CrudService } from '@src/core/helpers';
import { User, IUser, } from './users.model';
import { HttpException } from '@src/core/exceptions';
import { IRole, Role } from './role/roles.model';
import { Op } from 'sequelize';


class UserService extends CrudService<IUser> {
  constructor() {
    super(User, 'users-service');
  }
  public all = async (paginateRequest?: any): Promise<any> => {
    return await this.paginate(paginateRequest, {
      include: [{model: Role, as: 'role'}],
      order: [['id', 'DESC']],
    });
  };

  public getRoles = async(): Promise<IRole[]> => {
    return Role.findAll({where: {
      id: {[Op.ne]: 1}
    }});
  };

  public getByEmail = async (email: string): Promise<IUser> => {
    const user: IUser = await User.findOne<IUser>({
      where: { email },
      include: [
        { model: Role, as: 'role',},
      ]
    });
    if(!user) {
      throw new HttpException('Usuario no existe.', 401);
    }
    
    return user;
  };

  public getByUsername = async (username: string): Promise<IUser> => {
    const user: IUser = await User.findOne<IUser>({
      where: { username },
      attributes: { exclude: ['password']},
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name', 'slug']},
      ]
    });
    if(!user) {
      throw new HttpException('Usuario no existe.', 401);
    }
    
    return user;
  };
}

export const userService = new UserService();
