import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CalendarEventBlock } from "./CalendarEventBlock";
import type { CalendarEvent } from "../types";
import type { Booking } from "@/features/bookings/types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));
vi.mock("@/features/bookings/hooks/useUpdateBooking", () => ({
  useUpdateBooking: vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/features/bookings/hooks/useCheckAvailability", () => ({
  useCheckAvailability: vi.fn().mockReturnValue({ data: undefined, isFetching: false }),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const bookingEvent: CalendarEvent = {
  id: "booking-1",
  title: "Team Sync",
  startTime: new Date("2026-06-24T10:00:00"),
  endTime: new Date("2026-06-24T11:00:00"),
  type: "booking",
};

const googleEvent: CalendarEvent = {
  id: "google-1",
  title: "Google Meet",
  startTime: new Date("2026-06-24T14:00:00"),
  endTime: new Date("2026-06-24T15:00:00"),
  type: "google",
};

const mockBooking: Booking = {
  id: "booking-1",
  title: "Team Sync",
  description: null,
  startTime: "2026-06-24T10:00:00.000Z",
  endTime: "2026-06-24T11:00:00.000Z",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("CalendarEventBlock", () => {
  it("renders with bg-coral/20 class for type booking", () => {
    const { container } = render(
      <CalendarEventBlock
        event={bookingEvent}
        topPercent={10}
        heightPercent={7.7}
        bookingData={mockBooking}
      />,
      { wrapper: createWrapper() },
    );

    const block = container.querySelector(".bg-coral\\/20");
    expect(block).not.toBeNull();
  });

  it("renders a Lock icon for type google", () => {
    render(
      <CalendarEventBlock event={googleEvent} topPercent={40} heightPercent={7.7} />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Google Meet")).toBeDefined();
    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
