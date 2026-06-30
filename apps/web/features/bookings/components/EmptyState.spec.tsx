import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmptyState } from "./EmptyState";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("EmptyState", () => {
  it("renders the 'No bookings yet' heading", () => {
    render(<EmptyState />, { wrapper: createWrapper() });
    expect(screen.getByText("No bookings yet")).toBeDefined();
  });

  it("renders the descriptive paragraph", () => {
    render(<EmptyState />, { wrapper: createWrapper() });
    expect(screen.getByText(/Reserve your first time slot/)).toBeDefined();
  });

  it("renders a 'New booking' button", () => {
    render(<EmptyState />, { wrapper: createWrapper() });
    expect(screen.getByRole("button", { name: "New booking" })).toBeDefined();
  });
});
