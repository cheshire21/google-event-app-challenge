import { Suspense } from "react";
import type { JSX } from "react";
import { SettingsPage } from "@/features/settings/components/SettingsPage";

const ConnectPage = (): JSX.Element => (
  <Suspense>
    <SettingsPage />
  </Suspense>
);

export default ConnectPage;
