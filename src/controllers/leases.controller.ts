import { Request, Response, NextFunction } from "express";
import { leasesService } from "../services/leases.service";

export const leasesController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leasesService.create(req.appUser!.id, req.body);
      res.status(201).json({ data: lease });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await leasesService.list(req.appUser!.id, req.appUser!.role);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leasesService.getById(req.params.id);
      if (!lease) {
        res.status(404).json({ error: "Lease not found" });
        return;
      }

      // Tenants can only view their own leases
      if (req.appUser!.role === "tenant" && lease.tenantId !== req.appUser!.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      res.json({ data: lease });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leasesService.update(req.params.id, req.appUser!.id, req.body);
      res.json({ data: lease });
    } catch (err) {
      next(err);
    }
  },
};
