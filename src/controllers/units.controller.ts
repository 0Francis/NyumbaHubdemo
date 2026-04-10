import { Request, Response, NextFunction } from "express";
import { unitsService } from "../services/units.service";

export const unitsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await unitsService.create(req.params.propertyId, req.appUser!.id, req.body);
      res.status(201).json({ data: unit });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await unitsService.update(req.params.id, req.appUser!.id, req.body);
      res.json({ data: unit });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await unitsService.remove(req.params.id, req.appUser!.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
