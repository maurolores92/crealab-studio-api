import { NextFunction, Response } from "express";
import searchService from "./search.service";

class SearchController {
  public search = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await searchService.search(req.query.q);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
export default new SearchController();
