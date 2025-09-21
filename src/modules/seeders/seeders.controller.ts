import { NextFunction, Request, Response } from "express";
import seedersService from "./seeders.service";

class SeedersController {

  public seedOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { model } = req.params;
      const executed = await seedersService.seedOne(model);
      res.status(200).send(executed);
    } catch (error) {
      next(error);
    }
  }

  public seed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const executed = await seedersService.seed();
      res.status(200).send(executed);
    } catch (error) {
      next(error);
    }
  }
}

export default new SeedersController();
