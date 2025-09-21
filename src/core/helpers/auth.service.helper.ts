import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { BodyToken } from '@src/core/interfaces';
import { env } from '@src/core/configurations';
import { UserContext } from '@src/core/interfaces/user.interface';

class AuthServiceHelper {
  public passwordEncrypt = async (password: string): Promise<string> => {
    const genSalt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, genSalt);
  };

  public comparePassword = async (
    passwordDb: string,
    passwordReceived: string,
  ): Promise<any> => {
    return await bcrypt.compare(passwordReceived, passwordDb);
  };

  public generateToken = (bodyToken: BodyToken, tokenType: string, config: any) => {
    return jwt.sign(bodyToken, tokenType, config);
  };

  public getDataByToken = async (token: string): Promise<BodyToken> => {
    return new Promise((success, reject) => {
      jwt.verify(token, env.accessToken, (err, decoded: any) => {
        if (err) reject(err);
        const { id, username, fullName, date, role, roleId } = decoded;
        const user: BodyToken = { id, username, fullName, date, role, roleId };

        success(user);
      });
    });
  };
  public getDataByTokenAndKey = async (token: string): Promise<UserContext> => {
    return new Promise((success, reject) => {
      jwt.verify(token, env.accessToken, (err: any, decoded: any) => {
        if (err) reject(err);

        const { id, completeName, username, roleId } = decoded;
        const user: UserContext = {
          id, completeName, username, roleId,
        };
        success(user);
      });
    });
  };
}

export const authServiceHelper = new AuthServiceHelper();
