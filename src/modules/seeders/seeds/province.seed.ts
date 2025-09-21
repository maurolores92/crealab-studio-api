import { IProvince, Province } from "@src/modules/clients/address/province.model";
import AbstractSeed from "./abstract.seed";

class ProvinceSeed extends AbstractSeed<IProvince> {
  protected data: any[] = [
    { name: "Buenos Aires" },
    { name: "Catamarca" },
    { name: "Chaco" },
    { name: "Chubut" },
    { name: "Córdoba" },
    { name: "Corrientes" },
    { name: "Entre Ríos" },
    { name: "Formosa" },
    { name: "Jujuy" },
    { name: "La Pampa" },
    { name: "La Rioja" },
    { name: "Mendoza" },
    { name: "Misiones" },
    { name: "Neuquén" },
    { name: "Río Negro" },
    { name: "Salta" },
    { name: "San Juan" },
    { name: "San Luis" },
    { name: "Santa Cruz" },
    { name: "Santa Fe" },
    { name: "Santiago del Estero" },
    { name: "Tierra del Fuego" },
    { name: "Tucumán" }
  ];
  
  constructor() {
    super(Province, 'provinceSeed')
  }
}

export default new ProvinceSeed();
