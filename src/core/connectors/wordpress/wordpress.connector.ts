
import { wordpress } from "@src/core/configurations/wordpress";
import { ApiConnector } from "../api.connector";

class WordpressConnector extends ApiConnector {

  constructor() {
    super(`${wordpress.url}/wp-json/wc/v3`)
  }
  private auth = {
    username: wordpress.clientKey,
    password: wordpress.secretKey,
  }

  getProducts = async (params: any = {}) => {
    return this.client.get<any[]>('/products', { params, auth: this.auth }).then(res => res.data);
  }

  createProduct = async (data: any) => {
    return this.client.post<any>('/products', data, { auth: this.auth }).then(res => res.data);
  }

  getCategories = async (params: any = {}) => {
    return this.client.get<any[]>('/products/categories', { params, auth: this.auth }).then(res => res.data);
  }

  createCategory = async (data: any) => {
    return this.client.post<any>('/products/categories', data, { auth: this.auth }).then(res => res.data);
  }
}

export default new WordpressConnector();