import { z } from "zod";

export const createUnitSchema = z.object({
  unitNumber: z.string().min(1, "Unit number is required"),
  rentAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rent amount"),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
});

export const updateUnitSchema = z.object({
  unitNumber: z.string().min(1).optional(),
  rentAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  status: z.enum(["vacant", "occupied"]).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
});
