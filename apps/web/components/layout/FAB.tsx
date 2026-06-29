import type { JSX } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export const FAB = (): JSX.Element => (
  <Link
    href="/bookings/new"
    className="md:hidden fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-lg"
  >
    <Plus className="h-6 w-6" />
  </Link>
);

export default FAB;
