"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeColumn } from "./TimeColumn";
import { HOURS, MINUTES, isTimeBefore } from "./utils";

export interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  min,
  placeholder = "Pick a time",
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parsedHour = value ? value.split(":")[0] : "";
  const parsedMinute = value ? value.split(":")[1] : "";

  const [pendingHour, setPendingHour] = React.useState(parsedHour);
  const [pendingMinute, setPendingMinute] = React.useState(parsedMinute);

  const hourListRef = React.useRef<HTMLDivElement>(null);
  const minuteListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setPendingHour(value ? value.split(":")[0] : "");
    setPendingMinute(value ? value.split(":")[1] : "");
  }, [value]);

  const scrollTo = React.useCallback(
    (
      ref: React.RefObject<HTMLDivElement | null>,
      selector: string,
      block: ScrollLogicalPosition = "center",
      behavior: ScrollBehavior = "instant",
    ) => {
      ref.current?.querySelector(selector)?.scrollIntoView({ block, behavior });
    },
    [],
  );

  // Initial scroll when picker opens
  React.useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      if (pendingHour) {
        scrollTo(hourListRef, `[data-hour="${pendingHour}"]`);
      } else if (min) {
        const minHour = min.split(":")[0] ?? "00";
        scrollTo(hourListRef, `[data-hour="${minHour}"]`, "start");
      }
      if (pendingMinute) {
        scrollTo(minuteListRef, `[data-minute="${pendingMinute}"]`);
      }
    }, 40);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep selected item centered when selection changes while picker is open
  React.useEffect(() => {
    if (!open || !pendingHour) return;
    scrollTo(hourListRef, `[data-hour="${pendingHour}"]`, "center", "smooth");
  }, [pendingHour, open, scrollTo]);

  React.useEffect(() => {
    if (!open || !pendingMinute) return;
    scrollTo(minuteListRef, `[data-minute="${pendingMinute}"]`, "center", "smooth");
  }, [pendingMinute, open, scrollTo]);

  const commit = (h: string, m: string) => {
    if (h && m) {
      onChange(`${h}:${m}`);
      setOpen(false);
    }
  };

  const selectHour = (h: string) => {
    setPendingHour(h);
    if (pendingMinute) commit(h, pendingMinute);
  };

  const selectMinute = (m: string) => {
    setPendingMinute(m);
    if (pendingHour) commit(pendingHour, m);
  };

  const itemCls = (selected: boolean, disabled: boolean) =>
    cn(
      "w-10 rounded-md px-2 py-1.5 text-sm font-figtree transition-colors",
      selected ? "bg-coral text-white" : "text-brown hover:bg-coral/10",
      disabled && "pointer-events-none opacity-30",
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors",
            "font-figtree text-brown",
            "hover:border-coral/50 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <ClockIcon className="h-4 w-4 shrink-0 text-brown/50" />
          <span className="flex-1 text-left">{value ?? placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="z-[200] w-auto p-0" align="start">
        <div className="flex divide-x divide-border overflow-hidden rounded-md">
          <TimeColumn colRef={hourListRef}>
            {HOURS.map((h) => {
              const allDisabled = min ? MINUTES.every((m) => isTimeBefore(h, m, min)) : false;
              return (
                <button
                  key={h}
                  data-hour={h}
                  type="button"
                  disabled={allDisabled}
                  onClick={() => selectHour(h)}
                  className={itemCls(h === pendingHour, allDisabled)}
                >
                  {h}
                </button>
              );
            })}
          </TimeColumn>
          <TimeColumn colRef={minuteListRef}>
            {MINUTES.map((m) => {
              const disabled = !!(min && pendingHour && isTimeBefore(pendingHour, m, min));
              return (
                <button
                  key={m}
                  data-minute={m}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectMinute(m)}
                  className={itemCls(m === pendingMinute, disabled)}
                >
                  {m}
                </button>
              );
            })}
          </TimeColumn>
        </div>
      </PopoverContent>
    </Popover>
  );
}
