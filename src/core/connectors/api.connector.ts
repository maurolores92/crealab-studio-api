import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import applyCaseMiddleware from 'axios-case-converter';

export abstract class ApiConnector {
    protected client: AxiosInstance;
    constructor(baseUrl: string, headers: any = {}) {
        this.client = this.conn(baseUrl, headers);   
    }

    private conn = (baseUrl: string, headers: any = {}): AxiosInstance => {
      const config: AxiosRequestConfig = {
          baseURL: baseUrl,
          headers: {
              'Content-Type': 'application/json',
              ...headers
          },
          timeout: 20000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
      }
      return applyCaseMiddleware(axios.create(config));
    }

    public get = async <T>(path: string, params: any = {}): Promise<T> => {
      const result = await this.client.get<T>(path, {params});
      return result.data;
    };
    public post = async <T>(path: string, body: any): Promise<T> => {
      const result = await this.client.post<T>(path, body);
      return result.data;
    };
    public put = async <T>(path: string, body: any): Promise<T> => {
      const result = await this.client.put<T>(path, body);
      return result.data;
    };
    public delete = async <T>(path: string, params: any): Promise<T> => {
      const result = await this.client.delete<T>(path, {params});
      return result.data;
    };
}
