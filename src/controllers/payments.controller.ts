import { Request, Response, NextFunction } from "express";
import { paymentsService } from "../services/payments.service";

export const paymentsController = {
  async record(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentsService.record({
        ...req.body,
        tenantId: req.body.tenantId || req.appUser!.id,
      });
      res.status(201).json({ data: payment });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await paymentsService.list(req.appUser!.id, req.appUser!.role);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },
};
