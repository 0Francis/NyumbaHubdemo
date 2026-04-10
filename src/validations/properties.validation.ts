import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  propertyType: z.enum([
    "apartment", "studio", "bedsitter", "house", "office",
    "shop", "warehouse", "venue", "1BR", "2BR", "3BR", "restaurant", "other",
  ]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  agentId: z.string().uuid().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  propertyType: z.string().optional(),
  city: z.string().optional(),
});
