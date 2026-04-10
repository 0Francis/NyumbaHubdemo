import { z } from "zod";

export const syncUserSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .startsWith("+254", "Phone must start with +254")
    .max(14, "Phone must be at most 14 characters"),
  role: z.enum(["landlord", "agent", "tenant"]),
});
