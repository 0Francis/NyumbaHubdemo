import { Request, Response, NextFunction } from "express";
import { maintenanceService } from "../services/maintenance.service";

export const maintenanceController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await maintenanceService.create(req.appUser!.id, req.body);
      res.status(201).json({ data: request });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await maintenanceService.list(req.appUser!.id, req.appUser!.role);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await maintenanceService.update(
        req.params.id,
        req.appUser!.id,
        req.appUser!.role,
        req.body
      );
      res.json({ data: request });
    } catch (err) {
      next(err);
    }
  },
};
