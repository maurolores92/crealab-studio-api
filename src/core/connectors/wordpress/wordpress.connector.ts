import { wordpress } from "@src/core/configurations/wordpress";
import { ApiConnector } from "../api.connector";
import axios from "axios";

class WordpressConnector extends ApiConnector {
  // --- Autenticación y configuración ---
  constructor() {
    super(`${wordpress.url}/wp-json/wc/v3`);
  }
  private auth = {
    username: wordpress.clientKey,
    password: wordpress.secretKey,
  };

  private jwtToken: string | null = null;
  private jwtTokenExpires: number | null = null;

  
   // Obtiene y cachea el JWT para endpoints protegidos de WordPress
  private async getJwtToken() {
    if (this.jwtToken && this.jwtTokenExpires && Date.now() < this.jwtTokenExpires) {
      return this.jwtToken;
    }
    const res = await axios.post(`${wordpress.url}/wp-json/jwt-auth/v1/token`, {
      username: process.env.WORDPRESS_JWT_USER,
      password: process.env.WORDPRESS_JWT_PASS,
    });
    this.jwtToken = res.data.token;
    this.jwtTokenExpires = Date.now() + 60 * 60 * 1000;
    return this.jwtToken;
  }


  // --- Productos (bajo nivel, sin mapeo ni lógica de negocio) ---

  public async postProduct(data: any) {
    return this.client.post<any>(`/products`, data, { auth: this.auth }).then(res => res.data);
  }

  public async getProducts(params: any = {}) {
    return this.client.get<any[]>(`/products`, { params, auth: this.auth }).then(res => res.data);
  }

  public async getProductById(id: number) {
    return this.client.get<any>(`/products/${id}`, { auth: this.auth }).then(res => res.data);
  }

  public async putProduct(id: number, data: any) {
    return this.client.put<any>(`/products/${id}`, data, { auth: this.auth }).then(res => res.data);
  }

  public async deleteProduct(id: number) {
    return this.client.delete(`/products/${id}`, { auth: this.auth, params: { force: true } }).then(res => res.data);
  }

  public async setProductImage(productId: number, imageId: number) {
    const payload = { images: [{ id: imageId }] };
    return this.client.put<any>(`/products/${productId}`, payload, { auth: this.auth }).then(res => res.data);
  }


  //Sube una imagen a la librería de medios de WordPress
  uploadImage = async (fileOrBuffer: string | Buffer, fileName: string) => {
    const fs = require('fs');
    const FormData = require('form-data');
    let fileBuffer;
    if (typeof fileOrBuffer === 'string') {
      fileBuffer = fs.readFileSync(fileOrBuffer);
    } else {
      fileBuffer = fileOrBuffer;
    }
    const form = new FormData();
    form.append('file', fileBuffer, fileName);
    const url = `${wordpress.url}/wp-json/wp/v2/media`;
    const token = await this.getJwtToken();
    return axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    }).then((r: any) => r.data);
  }

  // --- Categorías ---

  //Crea una categoría de producto en WooCommerce
  async createProductCategory(data: { name: string; slug?: string; parent?: number; description?: string; image?: { id: number } }) {
    return this.client.post<any>('/products/categories', data, { auth: this.auth }).then(res => res.data);
  }


  //Actualiza una categoría de producto en WooCommerce
  async updateProductCategory(id: number, data: { name?: string; slug?: string; parent?: number; description?: string; image?: { id: number } }) {
    return this.client.put<any>(`/products/categories/${id}`, data, { auth: this.auth }).then(res => res.data);
  }


  //Elimina una categoría de producto en WooCommerce
  async deleteProductCategory(id: number) {
    return this.client.delete<any>(`/products/categories/${id}`, { auth: this.auth, params: { force: true } }).then(res => res.data);
  }


  //Obtiene categorías de WooCommerce (requiere JWT)
  getWpCategories = async (params: any = {}) => {
    const token = await this.getJwtToken();
    return this.client.get<any[]>(`${wordpress.url}/wp-json/wc/v3/products/categories`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);
  }


  //Crea una categoría en WordPress (no WooCommerce)
  createWpCategory = async (data: any) => {
    const token = await this.getJwtToken();
    return this.client.post<any>(`${wordpress.url}/wp-json/wp/v2/categories`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);
  }

  // --- Media (librería de medios) ---

  //Obtiene archivos de la librería de medios de WordPress
  public async getMedia(params: any = {}) {
    const token = await this.getJwtToken();
    return this.client.get<any[]>(`${wordpress.url}/wp-json/wp/v2/media`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);
  }
}
export default new WordpressConnector();