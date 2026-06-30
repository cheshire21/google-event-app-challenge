export const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
export const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function isTimeBefore(h: string, m: string, minTime: string): boolean {
  const parts = minTime.split(":");
  const minH = parts[0] ?? "00";
  const minM = parts[1] ?? "00";
  if (h < minH) return true;
  if (h === minH && m < minM) return true;
  return false;
}

export function stopScroll(e: React.WheelEvent<HTMLDivElement>): void {
  const el = e.currentTarget;
  const atTop = el.scrollTop === 0 && e.deltaY < 0;
  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight && e.deltaY > 0;
  if (!atTop && !atBottom) e.stopPropagation();
}
