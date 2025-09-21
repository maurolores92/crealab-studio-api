import { IRole, Role } from "@src/modules/users/role/roles.model"
import AbstractSeed from "./abstract.seed";

class RoleSeed extends AbstractSeed<IRole> {
  data: any[] = [
    { name: 'Super Admin', slug: 'super-admin' },
    { name: 'Admin', slug: 'admin' },
    { name: 'Vendedor', slug: 'seller' },
  ];
  constructor() {
    super(Role, 'role-seed');
  }
}

export default new RoleSeed();
