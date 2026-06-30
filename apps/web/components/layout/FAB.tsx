import type { JSX } from "react";
import { Plus } from "lucide-react";
import { NewBookingDialog } from "@/features/bookings/components/NewBookingDialog";

export const FAB = (): JSX.Element => (
  <NewBookingDialog
    trigger={
      <button
        type="button"
        className="md:hidden fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-lg"
        aria-label="New booking"
      >
        <Plus className="h-6 w-6" />
      </button>
    }
  />
);

export default FAB;
