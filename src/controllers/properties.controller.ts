import { Request, Response, NextFunction } from "express";
import { propertiesService } from "../services/properties.service";

export const propertiesController = {
  // Public
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertiesService.list(req.query as any);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  // Public
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.getById(req.params.id);
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }
      res.json({ data: property });
    } catch (err) {
      next(err);
    }
  },

  // Public
  async getUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await propertiesService.getUnitsForProperty(req.params.id);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  // Auth: landlord/agent
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.create(req.appUser!.id, req.body);
      res.status(201).json({ data: property });
    } catch (err) {
      next(err);
    }
  },

  // Auth: landlord/agent
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const property = await propertiesService.update(req.params.id, req.appUser!.id, req.body);
      res.json({ data: property });
    } catch (err) {
      next(err);
    }
  },

  // Auth: landlord
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await propertiesService.remove(req.params.id, req.appUser!.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // Auth: any authenticated user
  async contact(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await propertiesService.logContactInquiry(req.appUser!.id, req.params.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
};
