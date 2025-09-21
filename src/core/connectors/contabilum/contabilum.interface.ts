export interface ProductItem {
  id:               number;
  nombre:           string;
  codigo:           string;
  codigoOem:        string;
  codigoBarras:     string;
  descripcion:      string;
  precio:           number;
  precioFinal:      number;
  sincronizaStock:  boolean;
  precioAutomatico: null;
  sincronizaPrecio: boolean;
  iva:              number;
  rentabilidad:     number;
  costoInterno:     number;
  stock:            number;
  stockMinimo:      number;
  stockInventario:  number;
  observaciones:    string;
  estado:           string;
  tipo:             string;
  idRubro:          string;
  idSubrubro:       string;
  foto:             null;
  aplicaRg5329:     boolean;
  idMoneda:         number;
  listasDePrecio:   null;
  items:            null;
}


export interface ProductResponse {
  items: ProductItem[];
  totalItems: number;
  totalPages: number;
}

export interface TokenResponse {
  accessToken: string;
  tokenType:   string;
  expiresIn:   number;
}

export interface CategoryResponse {
  id:        number;
  nombre:    string;
  subRubros: SubRubro[];
}

export interface SubRubro {
  id:     number;
  nombre: string;
}

export interface CurrencyResponse {
  idMoneda:           number;
  descripcionMoneda:  string;
  codigoMoneda:       string;
  ultimoTipoDeCambio: number;
  esMonedaPorDefecto: boolean;
  activa:             boolean;
}

