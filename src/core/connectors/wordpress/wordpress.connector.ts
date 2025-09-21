import { wordpress } from "@src/core/configurations";
import { ApiConnector } from "../api.connector";

class WordpressConnector extends ApiConnector {
  constructor() {
    super(`${wordpress.url}/wp-json/wc/v3`)
  }
  private paramsKeys = {
    consumerKey: wordpress.clientKey,
    consumerSecret: wordpress.secretKey,
  }

  getOrders = async (params: any = {}) => {
    return this.get<any[]>('/orders', {...params, ...this.paramsKeys});
  }
}

export default new WordpressConnector();