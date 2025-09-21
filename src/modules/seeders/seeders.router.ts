import { Route } from "@src/core/interfaces/route.interface";
import { Router } from "express";
import seedersController from "./seeders.controller";

class SeedersRouter implements Route {
  public basePath = '/seeders';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post('/all', seedersController.seed);
    this.router.post('/one/:model', seedersController.seedOne);
  }
}

export default new SeedersRouter();
