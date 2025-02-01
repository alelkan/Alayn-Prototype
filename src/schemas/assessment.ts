import { z } from "zod";

export const assessmentSchema = z.object({
  userId: z.string(),
  answers: z.array(z.number().min(0).max(3)),
  timestamp: z.date().default(new Date()),
});