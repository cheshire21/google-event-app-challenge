import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { CancelConfirmDialog } from "./CancelConfirmDialog";
import type { Booking } from "../../types";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));

vi.mock("../../hooks/useDeleteBooking", () => ({
  useDeleteBooking: vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
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

describe("CancelConfirmDialog", () => {
  it("renders dialog with booking summary after clicking trigger", async () => {
    const user = userEvent.setup();
    render(
      <CancelConfirmDialog booking={mockBooking} trigger={<button>Cancel</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Cancel this booking?")).toBeDefined();
    expect(screen.getByText("Design Review")).toBeDefined();
  });

  it("closes dialog when Keep it is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CancelConfirmDialog booking={mockBooking} trigger={<button>Cancel</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Cancel this booking?")).toBeDefined();

    await user.click(screen.getByRole("button", { name: /keep it/i }));
    expect(screen.queryByText("Cancel this booking?")).toBeNull();
  });

  it("calls mutate when Cancel booking is clicked", async () => {
    const { useDeleteBooking } = await import("../../hooks/useDeleteBooking");
    const mockMutate = vi.fn();
    vi.mocked(useDeleteBooking).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as ReturnType<typeof useDeleteBooking>);

    const user = userEvent.setup();
    render(
      <CancelConfirmDialog booking={mockBooking} trigger={<button>Cancel</button>} />,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: /cancel booking/i }));

    expect(mockMutate).toHaveBeenCalledOnce();
  });
});
