import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BookingForm } from "./BookingForm";
import { useCheckAvailability } from "../../hooks/useCheckAvailability";

vi.mock("next/navigation", () => ({ useRouter: () => ({ back: vi.fn(), push: vi.fn() }) }));
vi.mock("../../hooks/useCheckAvailability", () => ({ useCheckAvailability: vi.fn() }));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

const defaultProps = {
  onSubmit: vi.fn(),
  isPending: false,
};

describe("BookingForm", () => {
  it("renders without availability feedback when no times are filled", () => {
    vi.mocked(useCheckAvailability).mockReturnValue({
      data: undefined,
      isFetching: false,
    } as ReturnType<typeof useCheckAvailability>);

    render(<BookingForm {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.queryByText("Scheduling conflict")).not.toBeInTheDocument();
    expect(screen.queryByText("This slot is free")).not.toBeInTheDocument();
  });

  it("shows ConflictWarning and 'Time unavailable' button when there is a conflict", () => {
    vi.mocked(useCheckAvailability).mockReturnValue({
      data: {
        available: false,
        conflicts: [
          {
            id: "1",
            title: "Overlap",
            startTime: "2026-06-30T10:00:00",
            endTime: "2026-06-30T11:00:00",
            type: "booking",
          },
        ],
      },
      isFetching: false,
    } as ReturnType<typeof useCheckAvailability>);

    render(<BookingForm {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText("Scheduling conflict")).toBeInTheDocument();
    expect(screen.getByText("Time unavailable")).toBeInTheDocument();
  });

  it("shows AvailableConfirmation and 'Confirm booking' button when slot is available", () => {
    vi.mocked(useCheckAvailability).mockReturnValue({
      data: {
        available: true,
        conflicts: [],
      },
      isFetching: false,
    } as ReturnType<typeof useCheckAvailability>);

    render(<BookingForm {...defaultProps} />, { wrapper: createWrapper() });

    expect(screen.getByText("This slot is free")).toBeInTheDocument();
    expect(screen.getByText("Confirm booking")).toBeInTheDocument();
  });
});
