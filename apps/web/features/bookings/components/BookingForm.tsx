"use client";

import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Clock, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";
import { bookingSchema, type BookingFormValues } from "../schemas/booking.schema";
import { useCheckAvailability } from "../hooks/useCheckAvailability";
import { toLocalISODate, buildISODateTime } from "../utils";
import { ConflictWarning } from "./ConflictWarning";
import { AvailableConfirmation } from "./AvailableConfirmation";
import type { CreateBookingPayload } from "../types";

interface BookingFormProps {
  initialValues?: Partial<BookingFormValues>;
  onSubmit: (payload: CreateBookingPayload) => void;
  isPending: boolean;
  excludeId?: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export const BookingForm = ({
  initialValues,
  onSubmit,
  isPending,
  excludeId,
  onCancel,
  submitLabel,
}: BookingFormProps): JSX.Element => {
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      date: initialValues?.date ?? new Date(),
      startTime: initialValues?.startTime ?? "",
      endTime: initialValues?.endTime ?? "",
    },
  });

  const { date, startTime, endTime } = form.watch();

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isToday =
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    toLocalISODate(date) === toLocalISODate(now);

  const dateStr =
    date instanceof Date && !isNaN(date.getTime())
      ? toLocalISODate(date)
      : undefined;
  const isoStart = dateStr && startTime ? buildISODateTime(dateStr, startTime) : undefined;
  const isoEnd = dateStr && endTime ? buildISODateTime(dateStr, endTime) : undefined;

  const debouncedStart = useDebounce(isoStart);
  const debouncedEnd = useDebounce(isoEnd);

  const { data: availability, isFetching } = useCheckAvailability(
    debouncedStart,
    debouncedEnd,
    excludeId,
  );

  const hasConflict = availability && !availability.available;
  const isAvailable = availability?.available === true && !isFetching;
  const submitDisabled = isPending || isFetching || !!hasConflict || !isoStart || !isoEnd;

  const handleSubmit = (values: BookingFormValues): void => {
    const ds = toLocalISODate(values.date);
    onSubmit({
      title: values.title,
      startTime: buildISODateTime(ds, values.startTime),
      endTime: buildISODateTime(ds, values.endTime),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
        {/* Booking name */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Roadmap Sync" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Day picker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : undefined}
                  onChange={(d) => field.onChange(d ?? new Date())}
                  minDate={new Date()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start / End times */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value || undefined}
                    onChange={field.onChange}
                    min={isToday ? currentTime : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End</FormLabel>
                <FormControl>
                  <TimePicker
                    value={field.value || undefined}
                    onChange={field.onChange}
                    min={startTime || (isToday ? currentTime : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Availability feedback */}
        {hasConflict && <ConflictWarning conflicts={availability?.conflicts ?? []} />}
        {isAvailable && <AvailableConfirmation />}

        {/* Actions */}
        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onCancel ? onCancel() : router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn(
              "flex-1",
              !submitDisabled ? "bg-coral text-white hover:bg-coral/90" : "",
            )}
            disabled={submitDisabled}
          >
            {hasConflict ? (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Time unavailable
              </>
            ) : (
              <>
                <CheckCheck className="mr-2 h-4 w-4" />
                {submitLabel ?? "Confirm booking"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
