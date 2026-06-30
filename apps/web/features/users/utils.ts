export const getUserInitial = (name?: string | null): string =>
  name?.[0]?.toUpperCase() ?? "?";
