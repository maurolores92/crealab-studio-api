import jwt from 'jsonwebtoken';
import { IUser, User } from '@src/modules/users/users.model';
import { LoginRequest, LoginResponse, BodyToken, ChangePasswordRequest } from '@src/core/interfaces';
import { HttpException } from '@src/core/exceptions';
import { userService } from '@src/modules/users/users.service';
import { authServiceHelper } from '@src/core/helpers';
import { env, sequelize } from '@src/core/configurations';
import { Role } from '../users/role/roles.model';
import { clientsService } from '../clients/client.service';

class AuthService {

  public login = async (data: LoginRequest): Promise<LoginResponse> => {
    const { email, password, type } = data;
    const user: IUser = await userService.getByEmail(email.toLocaleLowerCase());

    if (!user) {
      throw new HttpException(`El usuario ${email} no existe`, 403);
    }
    const comparePass = await authServiceHelper.comparePassword(
      user.password,
      password,
    );

    if (!comparePass) {
      throw new HttpException('La contraseña es incorrecta', 401);
    }

    
    const bodyToken: BodyToken = {
      email: user.email,
      fullName: user.name,
      id: user.id,
      username: user.username,
      date: new Date(),
      role: user.role,
      roleId: user.role.id,
    
    };
    
    const expire = type ? {expireIn: '24h'}: undefined;

    const accessToken: string = authServiceHelper.generateToken(
      bodyToken,
      env.accessToken,
      expire
    );
    const refreshToken: string = authServiceHelper.generateToken(
      bodyToken,
      env.refreshToken,
      expire
    );
    const response: LoginResponse = {
      id: user.id,
      email,
      fullName: user.name,
      username: user.username,
      role: user.role,
      roleId: user.role.id,
      accessToken,
      refreshToken, 
    
    };

    return response;
  };

  public me = async (tokenData: string): Promise<any> => {
    if(!tokenData || tokenData === '') {
      throw new Error('Token es invalido.');
    }
    const [_, token] = tokenData.split(' ');
    const verified = jwt.verify(token, env.accessToken);
    if (!verified) throw new Error('Token es invalido');
    const { username } = await authServiceHelper.getDataByToken(token);
    const user: IUser = await userService.getByUsername(username);

    return user;
  };

  public signUp = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const role = await Role.findOne({where: {slug: 'client'}});
      data.roleId = role.id;
      data.password = await authServiceHelper.passwordEncrypt(data.password);
      data.username = `${data.name.toLowerCase()}${data.lastName ? '.' + data.lastName?.toLowerCase(): ''}`;
      
      const user = await userService.create(data, transaction);
      await clientsService.createClient(data, transaction);
     
      await transaction.commit();
      delete user.password;
      
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
   
  };

  public registerUser = async (data: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const role = await Role.findByPk(data.roleId);
      if (!role) throw new Error('Rol no encontrado');
      data.roleId = role.id;
      data.password = await authServiceHelper.passwordEncrypt(data.password);
      data.username = data.username ?? `${data.name.toLowerCase()}${data.lastName ? '.' + data.lastName?.toLowerCase() : ''}`;
      const user = await userService.create(data, transaction);
      await transaction.commit();
      delete user.password;
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  public changePassword = async (request: ChangePasswordRequest): Promise<any> => {
    const user = await User.findByPk(request.userId);
    user.password = await authServiceHelper.passwordEncrypt(request.newPassword);

    user.save();
    return { success: true };
  };
}

export const authService = new AuthService();
