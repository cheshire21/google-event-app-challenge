import api from "@/lib/api";

export const getGoogleAuthUrl = (): Promise<string> =>
  api.get<{ url: string }>("/google/auth-url").then((r) => r.data.url);

export const disconnectGoogleCalendar = (): Promise<void> =>
  api.delete("/google/disconnect").then(() => undefined);

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export const getGoogleEvents = (
  start: string,
  end: string,
): Promise<GoogleCalendarEvent[]> =>
  api
    .get<GoogleCalendarEvent[]>("/google/events", { params: { start, end } })
    .then((r) => r.data);
