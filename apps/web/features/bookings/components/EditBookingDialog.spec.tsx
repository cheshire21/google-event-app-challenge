import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { EditBookingDialog } from "./EditBookingDialog";
import { useCheckAvailability } from "../hooks/useCheckAvailability";
import { useUpdateBooking } from "../hooks/useUpdateBooking";
import type { Booking } from "../types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));
vi.mock("../hooks/useCheckAvailability", () => ({
  useCheckAvailability: vi.fn().mockReturnValue({ data: undefined, isFetching: false }),
}));
vi.mock("../hooks/useUpdateBooking", () => ({
  useUpdateBooking: vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const mockBooking: Booking = {
  id: "abc-123",
  title: "Design Review",
  startTime: "2026-06-30T10:00:00.000Z",
  endTime: "2026-06-30T11:00:00.000Z",
  description: null,
  createdAt: "2026-06-29T00:00:00.000Z",
  updatedAt: "2026-06-29T00:00:00.000Z",
};

describe("EditBookingDialog", () => {
  it("pre-populates the title input with the booking title", async () => {
    const user = userEvent.setup();
    render(
      <EditBookingDialog booking={mockBooking} trigger={<button>Open</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(screen.getByDisplayValue("Design Review")).toBeInTheDocument();
  });

  it("passes excludeId to useCheckAvailability", async () => {
    const user = userEvent.setup();
    render(
      <EditBookingDialog booking={mockBooking} trigger={<button>Open</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    const calls = vi.mocked(useCheckAvailability).mock.calls;
    expect(calls[calls.length - 1][2]).toBe(mockBooking.id);
  });

  it("calls mutate when the form is submitted", async () => {
    const mockMutate = vi.fn();
    vi.mocked(useUpdateBooking).mockReturnValue({ mutate: mockMutate, isPending: false });

    const user = userEvent.setup();
    render(
      <EditBookingDialog booking={mockBooking} trigger={<button>Open</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
  });
});
