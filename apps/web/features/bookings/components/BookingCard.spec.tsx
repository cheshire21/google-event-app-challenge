import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Booking } from "../types";
import { BookingCard } from "./BookingCard";

const mockBooking: Booking = {
  id: "booking-1",
  title: "Design Review",
  description: null,
  startTime: "2026-06-23T10:00:00.000Z",
  endTime: "2026-06-23T11:00:00.000Z",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("BookingCard", () => {
  it("renders the booking title", () => {
    render(<BookingCard booking={mockBooking} onCancel={vi.fn()} />);
    expect(screen.getByText("Design Review")).toBeDefined();
  });

  it("renders the duration as 1h for a 60-minute booking", () => {
    render(<BookingCard booking={mockBooking} onCancel={vi.fn()} />);
    expect(screen.getByText(/1h/)).toBeDefined();
  });

  it("renders the day number from startTime", () => {
    render(<BookingCard booking={mockBooking} onCancel={vi.fn()} />);
    const start = new Date(mockBooking.startTime);
    expect(screen.getByText(String(start.getDate()))).toBeDefined();
  });

  it("calls onCancel with the booking id when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(<BookingCard booking={mockBooking} onCancel={handleCancel} />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleCancel).toHaveBeenCalledOnce();
    expect(handleCancel).toHaveBeenCalledWith("booking-1");
  });
});
