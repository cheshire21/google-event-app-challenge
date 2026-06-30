import { z } from "zod";

export const bookingSchema = z
  .object({
    title: z.string().min(1, "Booking name is required"),
    date: z.date(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
