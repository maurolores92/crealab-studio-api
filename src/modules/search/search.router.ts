import { Route } from "@src/core/interfaces/route.interface";
import { Router } from "express";
import searchController from "./search.controller";

class SearchRoute implements Route {
  basePath = '/search';
  router = Router();
  constructor() {
    this.initRoutes();
  }
  private initRoutes = () => {
    this.router.get('/', searchController.search);
  }
}

export default new SearchRoute();
