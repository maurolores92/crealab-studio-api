import { contabilum } from "@src/core/configurations";
import { ApiConnector } from "../api.connector";
import { TokenResponse } from "./contabilum.interface";

export enum ContabilumPaths {
  PRODUCTS = 'conceptos/search',
  CATEGORIES = 'conceptos/rubros',
  CURRENCIES = 'monedas/search',
}

const getQuery = (params: any) => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

class ContabilumConnector extends ApiConnector {
  constructor() {
    super(contabilum.url);
  }

  public async getAccessToken(): Promise<TokenResponse> {
    try {
      const body: any = {
        client_id: contabilum.clientKey,
        client_secret: contabilum.secretKey,
        grant_type: 'client_credentials'
      };
      
      const result = await this.client.post<TokenResponse>('/token', getQuery(body), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return result.data;
    } catch (error: any) {
      throw new Error(`Contabilum ERROR - Get Token - ${error.message}`);
    }
  }

  public async findAll <T>(path: ContabilumPaths, token: string, params: any = {}): Promise<T> {
    try {
      const query = getQuery(params) !== '' ? `?${getQuery(params)}` : '';
      const result: {data: T} = await this.client.get<T>(`/api/${path}${query}`, {
        params,
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return result.data;
    } catch (error) {
      throw new Error(`Contabilum ERROR - Get Products - ${error.message}`);
    }
  }

}

export const contabilumConnector = new ContabilumConnector();
