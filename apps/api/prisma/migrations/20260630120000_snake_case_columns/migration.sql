-- Rename tables to snake_case
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Booking" RENAME TO "bookings";

-- Rename User columns
ALTER TABLE "users" RENAME COLUMN "auth0Id" TO "auth0_id";
ALTER TABLE "users" RENAME COLUMN "googleAccessToken" TO "google_access_token";
ALTER TABLE "users" RENAME COLUMN "googleRefreshToken" TO "google_refresh_token";
ALTER TABLE "users" RENAME COLUMN "googleTokenExpiry" TO "google_token_expiry";
ALTER TABLE "users" RENAME COLUMN "hasGoogleCalendar" TO "has_google_calendar";
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename Booking columns
ALTER TABLE "bookings" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "bookings" RENAME COLUMN "startTime" TO "start_time";
ALTER TABLE "bookings" RENAME COLUMN "endTime" TO "end_time";
ALTER TABLE "bookings" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "bookings" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename constraints and indexes to match new names
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER INDEX "User_auth0Id_key" RENAME TO "users_auth0_id_key";
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
ALTER TABLE "bookings" RENAME CONSTRAINT "Booking_pkey" TO "bookings_pkey";
ALTER TABLE "bookings" RENAME CONSTRAINT "Booking_userId_fkey" TO "bookings_user_id_fkey";
