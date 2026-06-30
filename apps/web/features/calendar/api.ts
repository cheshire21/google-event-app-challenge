import api from "@/lib/api";
import type { CurrentUser, GoogleCalendarEventDto } from "./types";

export const getGoogleCalendarEvents = (
  start: string,
  end: string,
): Promise<GoogleCalendarEventDto[]> =>
  api
    .get<GoogleCalendarEventDto[]>("/google/events", { params: { start, end } })
    .then((r) => r.data);

export const getCurrentUser = (): Promise<CurrentUser> =>
  api.get<CurrentUser>("/users/me").then((r) => r.data);
