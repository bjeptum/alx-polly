import { z } from "zod";

export const pollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1)).min(2, "At least two options required").max(10),
});

export type PollInput = z.infer<typeof pollSchema>;


