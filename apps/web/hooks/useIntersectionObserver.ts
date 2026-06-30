import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  onIntersect: () => void,
  enabled = true,
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onIntersect();
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);

  return ref;
};
