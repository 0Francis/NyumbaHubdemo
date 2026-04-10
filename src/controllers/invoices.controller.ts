import { Request, Response, NextFunction } from "express";
import { invoicesService } from "../services/invoices.service";

export const invoicesController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await invoicesService.create(req.body);
      res.status(201).json({ data: invoice });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await invoicesService.list(req.appUser!.id, req.appUser!.role);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await invoicesService.getById(req.params.id);
      if (!invoice) {
        res.status(404).json({ error: "Invoice not found" });
        return;
      }

      // Tenants can only view their own invoices
      if (req.appUser!.role === "tenant" && invoice.tenantId !== req.appUser!.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      res.json({ data: invoice });
    } catch (err) {
      next(err);
    }
  },
};
