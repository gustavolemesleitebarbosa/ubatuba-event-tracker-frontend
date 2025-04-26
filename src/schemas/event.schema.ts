import { z } from "zod";
import { EVENT_CATEGORIES } from "@/constants/categories";

export const createEventSchema = z.object({
  title: z.string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z.string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be less than 500 characters" }),
  location: z.string()
    .min(1, { message: "Location is required" }),
  date: z.string()
    .min(1, { message: "Date is required" }),
  image: z.string().optional(),
  category: z.enum(EVENT_CATEGORIES).nullable().optional()
});

export type CreateEventInput = z.infer<typeof createEventSchema>; 