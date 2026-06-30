import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { GoogleCalendarCard } from "./GoogleCalendarCard";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useDisconnectCalendar } from "../hooks/useDisconnectCalendar";

vi.mock("@/features/users/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("../hooks/useDisconnectCalendar", () => ({
  useDisconnectCalendar: vi.fn(),
}));

vi.mock("../api", () => ({
  getGoogleAuthUrl: vi.fn().mockResolvedValue("https://accounts.google.com/o/oauth2/auth"),
  disconnectGoogleCalendar: vi.fn().mockResolvedValue(undefined),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

const mockDisconnect = vi.fn();

beforeEach(() => {
  vi.mocked(useDisconnectCalendar).mockReturnValue({
    mutate: mockDisconnect,
    isPending: false,
  } as unknown as ReturnType<typeof useDisconnectCalendar>);
});

describe("GoogleCalendarCard", () => {
  it("renders loading skeleton when user is loading", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useCurrentUser>);

    render(<GoogleCalendarCard />, { wrapper: createWrapper() });

    expect(screen.queryByText("Calendar not connected")).not.toBeInTheDocument();
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
  });

  it("renders connected state with email and Connected badge", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: "1", email: "maya@hey.com", name: "Maya Chen", hasGoogleCalendar: true },
      isLoading: false,
    } as ReturnType<typeof useCurrentUser>);

    render(<GoogleCalendarCard />, { wrapper: createWrapper() });

    expect(screen.getByText("maya@hey.com")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /disconnect/i })).toBeInTheDocument();
  });

  it("renders connected state feature rows", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: "1", email: "maya@hey.com", name: "Maya Chen", hasGoogleCalendar: true },
      isLoading: false,
    } as ReturnType<typeof useCurrentUser>);

    render(<GoogleCalendarCard />, { wrapper: createWrapper() });

    expect(screen.getByText("Conflict checking is active")).toBeInTheDocument();
    expect(screen.getByText("Two-way visibility")).toBeInTheDocument();
  });

  it("renders disconnected state with Calendar not connected heading", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: "1", email: "maya@hey.com", name: "Maya Chen", hasGoogleCalendar: false },
      isLoading: false,
    } as ReturnType<typeof useCurrentUser>);

    render(<GoogleCalendarCard />, { wrapper: createWrapper() });

    expect(screen.getByText("Calendar not connected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /connect google calendar/i })).toBeInTheDocument();
  });

  it("renders disconnected state when user has no Google Calendar", () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as ReturnType<typeof useCurrentUser>);

    render(<GoogleCalendarCard />, { wrapper: createWrapper() });

    expect(screen.getByText("Calendar not connected")).toBeInTheDocument();
  });
});
