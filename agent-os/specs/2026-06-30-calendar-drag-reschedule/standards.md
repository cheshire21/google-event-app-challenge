# Standards for Calendar Drag Reschedule

## frontend/component-architecture

- features/ vs components/ split: calendar components stay in `features/calendar/components/`
- Add `"use client"` only on components that use hooks or event handlers
- Use `cn()` from `lib/utils.ts` to merge Tailwind classes conditionally

## frontend/tailwind-tokens

- Use design tokens only: `cursor-grab`, `cursor-grabbing`, `opacity-60`, `bg-coral`, `text-coral`
- No arbitrary hex values (`bg-[#hex]` is forbidden)
- Drag feedback: `opacity-60` on the dragging block, `cursor-grabbing` on the grabbing element
