import { z } from "zod";

export const createMaintenanceSchema = z.object({
  unitId: z.string().uuid("Invalid unit ID"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});
