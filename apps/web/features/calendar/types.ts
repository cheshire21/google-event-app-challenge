export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: "booking" | "google";
}

export interface GoogleCalendarEventDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: "google";
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  hasGoogleCalendar: boolean;
}
